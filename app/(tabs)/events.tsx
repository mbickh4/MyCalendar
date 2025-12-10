import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useEventStore } from '../../stores/eventStore';

const COLORS = {
  primary: "#6366F1",
  primaryDark: "#4F46E5",
  secondary: "#EC4899",
  background: "#020617",
  surface: "#0F172A",
  surfaceSoft: "#111827",
  border: "#1F2937",
  text: "#E5E7EB",
  textSecondary: "#9CA3AF",
  accent: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
};

export default function EventsScreen() {
  const { events, toggleEventComplete, deleteEvent } = useEventStore();
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filter === 'upcoming') {
      return eventDate >= today && !event.completed;
    } else if (filter === 'past') {
      return eventDate < today || event.completed;
    }
    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const groupEventsByMonth = () => {
    const groups: Record<string, typeof events> = {};
    
    filteredEvents.forEach((event) => {
      const date = new Date(event.date);
      const monthYear = date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(event);
    });
    
    return groups;
  };

  const eventGroups = groupEventsByMonth();
  const monthKeys = Object.keys(eventGroups);

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'High':
        return COLORS.danger;
      case 'Medium':
        return COLORS.warning;
      case 'Low':
        return COLORS.accent;
      default:
        return COLORS.textSecondary;
    }
  };

  const handleAddEvent = () => {
    router.push('/add-event');
  };

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {(['upcoming', 'past', 'all'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, filter === tab && styles.filterTabActive]}
            onPress={() => setFilter(tab)}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === tab && styles.filterTabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Event FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddEvent}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="calendar" size={48} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>
            {filter === 'upcoming'
              ? 'No upcoming events'
              : filter === 'past'
              ? 'No past events'
              : 'No events scheduled'}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddEvent}
          >
            <Text style={styles.addButtonText}>Add Event</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {monthKeys.map((monthYear) => (
            <View key={monthYear} style={styles.monthSection}>
              <Text style={styles.monthHeader}>{monthYear}</Text>
              {eventGroups[monthYear].map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <View style={styles.eventDateContainer}>
                    <Text style={styles.eventDay}>
                      {new Date(event.date).getDate()}
                    </Text>
                    <Text style={styles.eventWeekday}>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                      })}
                    </Text>
                  </View>
                  
                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <Text
                        style={[
                          styles.eventTitle,
                          event.completed && styles.eventTitleCompleted,
                        ]}
                      >
                        {event.title}
                      </Text>
                      {event.priority && (
                        <View
                          style={[
                            styles.priorityBadge,
                            { backgroundColor: getPriorityColor(event.priority) + '20' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.priorityText,
                              { color: getPriorityColor(event.priority) },
                            ]}
                          >
                            {event.priority}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    {event.notes && (
                      <Text style={styles.eventNotes} numberOfLines={2}>
                        {event.notes}
                      </Text>
                    )}
                    
                    <View style={styles.eventActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => toggleEventComplete(event.id)}
                      >
                        <Feather
                          name={event.completed ? 'rotate-ccw' : 'check'}
                          size={16}
                          color={COLORS.primary}
                        />
                        <Text style={styles.actionText}>
                          {event.completed ? 'Undo' : 'Complete'}
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => deleteEvent(event.id)}
                      >
                        <Feather name="trash-2" size={16} color={COLORS.danger} />
                        <Text style={[styles.actionText, { color: COLORS.danger }]}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterContainer: {
    maxHeight: 50,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 999,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  monthSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  monthHeader: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eventDateContainer: {
    width: 48,
    alignItems: 'center',
    marginRight: 16,
  },
  eventDay: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '600',
  },
  eventWeekday: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  eventTitleCompleted: {
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  eventNotes: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
  },
});