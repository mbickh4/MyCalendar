import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
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

export default function OverviewScreen() {
  const { events, todos } = useEventStore();

  // Calculate statistics
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events.filter(
    (e) => new Date(e.date) >= today && !e.completed
  );
  const completedEvents = events.filter((e) => e.completed);
  const todayEvents = events.filter(
    (e) => e.date === today.toISOString().split('T')[0]
  );
  
  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);
  
  const highPriorityEvents = events.filter((e) => e.priority === 'High' && !e.completed);
  const mediumPriorityEvents = events.filter((e) => e.priority === 'Medium' && !e.completed);
  const lowPriorityEvents = events.filter((e) => e.priority === 'Low' && !e.completed);

  // Get next upcoming event
  const nextEvent = upcomingEvents.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )[0];

  // Calculate completion rate
  const totalTasks = todos.length;
  const completionRate = totalTasks > 0 
    ? Math.round((completedTodos.length / totalTasks) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Stats */}
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroHeader}>
          <Text style={styles.heroTitle}>Your Overview</Text>
          <Text style={styles.heroDate}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        
        <View style={styles.heroStats}>
          <View style={styles.heroStatItem}>
            <Text style={styles.heroStatValue}>{todayEvents.length}</Text>
            <Text style={styles.heroStatLabel}>Today&apos;s Events</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStatItem}>
            <Text style={styles.heroStatValue}>{activeTodos.length}</Text>
            <Text style={styles.heroStatLabel}>Active Tasks</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStatItem}>
            <Text style={styles.heroStatValue}>{completionRate}%</Text>
            <Text style={styles.heroStatLabel}>Completed</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Next Event Card */}
      {nextEvent && (
        <View style={styles.nextEventCard}>
          <View style={styles.nextEventHeader}>
            <Feather name="clock" size={20} color={COLORS.primary} />
            <Text style={styles.nextEventTitle}>Next Event</Text>
          </View>
          <Text style={styles.nextEventName}>{nextEvent.title}</Text>
          <Text style={styles.nextEventDate}>
            {new Date(nextEvent.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          {nextEvent.notes && (
            <Text style={styles.nextEventNotes} numberOfLines={2}>
              {nextEvent.notes}
            </Text>
          )}
        </View>
      )}

      {/* Priority Breakdown */}
      <View style={styles.priorityCard}>
        <Text style={styles.sectionTitle}>Priority Breakdown</Text>
        <View style={styles.priorityList}>
          <View style={styles.priorityItem}>
            <View style={[styles.priorityDot, { backgroundColor: COLORS.danger }]} />
            <Text style={styles.priorityLabel}>High Priority</Text>
            <Text style={styles.priorityCount}>{highPriorityEvents.length}</Text>
          </View>
          <View style={styles.priorityItem}>
            <View style={[styles.priorityDot, { backgroundColor: COLORS.warning }]} />
            <Text style={styles.priorityLabel}>Medium Priority</Text>
            <Text style={styles.priorityCount}>{mediumPriorityEvents.length}</Text>
          </View>
          <View style={styles.priorityItem}>
            <View style={[styles.priorityDot, { backgroundColor: COLORS.accent }]} />
            <Text style={styles.priorityLabel}>Low Priority</Text>
            <Text style={styles.priorityCount}>{lowPriorityEvents.length}</Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Feather name="calendar" size={24} color={COLORS.primary} />
          <Text style={styles.statValue}>{upcomingEvents.length}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        
        <View style={styles.statCard}>
          <Feather name="check-circle" size={24} color={COLORS.accent} />
          <Text style={styles.statValue}>{completedEvents.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        
        <View style={styles.statCard}>
          <Feather name="list" size={24} color={COLORS.secondary} />
          <Text style={styles.statValue}>{events.length}</Text>
          <Text style={styles.statLabel}>Total Events</Text>
        </View>
        
        <View style={styles.statCard}>
          <Feather name="check-square" size={24} color={COLORS.warning} />
          <Text style={styles.statValue}>{todos.length}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityCard}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {events.slice(0, 3).map((event) => (
          <View key={event.id} style={styles.activityItem}>
            <View
              style={[
                styles.activityIndicator,
                { backgroundColor: event.completed ? COLORS.accent : COLORS.primary },
              ]}
            />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{event.title}</Text>
              <Text style={styles.activityDate}>
                {new Date(event.date).toLocaleDateString()}
              </Text>
            </View>
            {event.completed && (
              <Feather name="check" size={16} color={COLORS.accent} />
            )}
          </View>
        ))}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  heroCard: {
    borderRadius: 20,
    padding: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  heroHeader: {
    marginBottom: 24,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  heroDate: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 4,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  heroStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  nextEventCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nextEventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  nextEventTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  nextEventName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  nextEventDate: {
    color: COLORS.primary,
    fontSize: 14,
    marginBottom: 8,
  },
  nextEventNotes: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  priorityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  priorityList: {
    gap: 12,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  priorityLabel: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
  },
  priorityCount: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  activityDate: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});