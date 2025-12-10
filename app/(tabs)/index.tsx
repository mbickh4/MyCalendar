import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useEventStore } from '../../stores/eventStore';

const COLORS = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  secondary: '#EC4899',
  background: '#020617',
  surface: '#0F172A',
  surfaceSoft: '#111827',
  border: '#1F2937',
  text: '#E5E7EB',
  textSecondary: '#9CA3AF',
  accent: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
};

const FONTS = {
  display: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
};

export default function HomeScreen() {
  const { events, selectedDate, setSelectedDate } = useEventStore();
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

  // Initialize selected date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, [setSelectedDate]);

  // Keep calendar dots in sync with events
  useEffect(() => {
    const next: Record<string, any> = {};
    events.forEach((event: any) => {
      const color =
        event.priority === 'High'
          ? COLORS.danger
          : event.priority === 'Medium'
          ? COLORS.warning
          : COLORS.accent;

      next[event.date] = {
        ...(next[event.date] || {}),
        marked: true,
        dotColor: color,
      };
    });
    setMarkedDates(next);
  }, [events]);

  const todaysEvents = events
    .filter((e: any) => e.date === selectedDate)
    .sort((a: any, b: any) => a.title.localeCompare(b.title));

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const handleAddEvent = () => {
    // Cast to any to satisfy Expo Router's typed routes
    router.push('/add-event' as any);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Calendar Card */}
      <View style={styles.calendarCard}>
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.calendarGradient}
        >
          <View style={styles.calendarHeader}>
            <Text style={[FONTS.caption, { color: COLORS.textSecondary }]}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </Text>
            <Text style={[FONTS.display, { color: COLORS.text }]}>
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                ...(markedDates[selectedDate] || {}),
                selected: true,
                selectedColor: COLORS.primary,
              },
            }}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              selectedDayBackgroundColor: COLORS.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: COLORS.secondary,
              dayTextColor: COLORS.text,
              textDisabledColor: '#4B5563',
              dotColor: COLORS.primary,
              monthTextColor: COLORS.text,
              arrowColor: COLORS.text,
              textDayFontWeight: '500',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '400',
            }}
            style={styles.calendar}
          />
        </LinearGradient>
      </View>

      {/* Selected Date Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={[FONTS.subtitle, { color: COLORS.text }]}>
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <TouchableOpacity onPress={handleAddEvent} style={styles.addButton}>
            <Feather name="plus" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {todaysEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="calendar" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No events scheduled</Text>
            <TouchableOpacity
              onPress={handleAddEvent}
              style={styles.addEventButton}
            >
              <Text style={styles.addEventButtonText}>Add Event</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.eventsList}>
            {todaysEvents.map((event: any) => (
              <View key={event.id} style={styles.eventItem}>
                <View
                  style={[
                    styles.eventIndicator,
                    event.priority === 'High'
                      ? { backgroundColor: COLORS.danger }
                      : event.priority === 'Medium'
                      ? { backgroundColor: COLORS.warning }
                      : { backgroundColor: COLORS.accent },
                  ]}
                />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  {event.notes ? (
                    <Text style={styles.eventNotes} numberOfLines={1}>
                      {event.notes}
                    </Text>
                  ) : null}
                </View>
                {event.completed && (
                  <Feather name="check-circle" size={20} color={COLORS.accent} />
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/tasks' as any)}
        >
          <LinearGradient
            colors={['rgba(99,102,241,0.1)', 'rgba(99,102,241,0.05)']}
            style={styles.actionGradient}
          >
            <Feather name="check-square" size={24} color={COLORS.primary} />
            <Text style={styles.actionText}>Tasks</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/events' as any)}
        >
          <LinearGradient
            colors={['rgba(236,72,153,0.1)', 'rgba(236,72,153,0.05)']}
            style={styles.actionGradient}
          >
            <Feather name="list" size={24} color={COLORS.secondary} />
            <Text style={styles.actionText}>Events</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  calendarCard: {
    marginTop: 16,
  },
  calendarGradient: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  calendarHeader: {
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 12,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(99,102,241,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 12,
    marginBottom: 16,
  },
  addEventButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
  },
  addEventButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  eventsList: {
    gap: 8,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSoft,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  eventIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
    minHeight: 40,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  eventNotes: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
  },
  actionGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
});
