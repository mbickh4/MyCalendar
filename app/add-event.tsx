import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEventStore, EventItem } from '../stores/eventStore';

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

export default function AddEventScreen() {
  const { addEvent, selectedDate } = useEventStore();
  
  const [eventTitle, setEventTitle] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [eventPriority, setEventPriority] = useState<EventItem['priority']>(null);
  const [eventDate, setEventDate] = useState(selectedDate);

  const handleSave = () => {
    if (!eventTitle.trim()) {
      Alert.alert('Missing Information', 'Please enter an event title.');
      return;
    }

    if (!eventDate) {
      Alert.alert('Missing Information', 'Please select a date for the event.');
      return;
    }

    const newEvent: EventItem = {
      id: Date.now().toString(),
      title: eventTitle.trim(),
      date: eventDate,
      notes: eventNotes.trim() || undefined,
      priority: eventPriority,
      completed: false,
    };

    addEvent(newEvent);
    router.back();
  };

  const PriorityButton = ({ 
    priority, 
    label 
  }: { 
    priority: 'High' | 'Medium' | 'Low'; 
    label: string;
  }) => {
    const isSelected = eventPriority === priority;
    const getColor = () => {
      switch (priority) {
        case 'High':
          return COLORS.danger;
        case 'Medium':
          return COLORS.warning;
        case 'Low':
          return COLORS.accent;
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.priorityButton,
          isSelected && {
            backgroundColor: getColor() + '20',
            borderColor: getColor(),
          },
        ]}
        onPress={() => setEventPriority(isSelected ? null : priority)}
      >
        <View style={[styles.priorityDot, { backgroundColor: getColor() }]} />
        <Text
          style={[
            styles.priorityButtonText,
            isSelected && { color: getColor(), fontWeight: '600' },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Feather name="x" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Event</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>
          <Calendar
            onDayPress={(day: any) => setEventDate(day.dateString)}
            markedDates={{
              [eventDate]: {
                selected: true,
                selectedColor: COLORS.primary,
              },
            }}
            theme={{
              backgroundColor: COLORS.surface,
              calendarBackground: COLORS.surface,
              selectedDayBackgroundColor: COLORS.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: COLORS.secondary,
              dayTextColor: COLORS.text,
              textDisabledColor: '#4B5563',
              monthTextColor: COLORS.text,
              arrowColor: COLORS.text,
              textDayFontWeight: '500',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '400',
            }}
            style={styles.calendar}
          />
        </View>

        {/* Event Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <View style={styles.inputWrapper}>
              <Feather name="type" size={16} color={COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="What&apos;s happening?"
                placeholderTextColor={COLORS.textSecondary}
                value={eventTitle}
                onChangeText={setEventTitle}
                autoFocus
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <Feather
                name="file-text"
                size={16}
                color={COLORS.textSecondary}
                style={styles.textAreaIcon}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add some details..."
                placeholderTextColor={COLORS.textSecondary}
                value={eventNotes}
                onChangeText={setEventNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              <PriorityButton priority="High" label="High" />
              <PriorityButton priority="Medium" label="Medium" />
              <PriorityButton priority="Low" label="Low" />
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Feather name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save Event</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 16,
  },
  calendar: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
  },
  textAreaIcon: {
    marginTop: 14,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 14,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
    paddingBottom: 14,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});