import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { TodoItem, useEventStore } from '../../stores/eventStore';

const COLORS = {
  primary: "#6366F1",
  background: "#020617",
  surface: "#0F172A",
  surfaceSoft: "#111827",
  border: "#1F2937",
  text: "#E5E7EB",
  textSecondary: "#9CA3AF",
  accent: "#10B981",
  danger: "#EF4444",
};

export default function TasksScreen() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useEventStore();
  const [todoInput, setTodoInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleAddTodo = () => {
    if (!todoInput.trim()) return;
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: todoInput.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    addTodo(newTodo);
    setTodoInput('');
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const incompleteTodos = todos.filter((t) => !t.completed).length;
  const completedTodos = todos.filter((t) => t.completed).length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Active</Text>
            <Text style={styles.statValue}>{incompleteTodos}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{completedTodos}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{todos.length}</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {(['all', 'active', 'completed'] as const).map((tab) => (
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
        </View>

        {/* Add Todo Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Feather name="edit-3" size={16} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="What needs to be done?"
              placeholderTextColor={COLORS.textSecondary}
              value={todoInput}
              onChangeText={setTodoInput}
              onSubmitEditing={handleAddTodo}
              returnKeyType="done"
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTodo}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Todos List */}
        {filteredTodos.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="check-circle" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? 'No tasks yet'
                : filter === 'active'
                ? 'No active tasks'
                : 'No completed tasks'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTodos}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => toggleTodo(item.id)}
                style={styles.todoItem}
              >
                <View
                  style={[
                    styles.checkbox,
                    item.completed && styles.checkboxChecked,
                  ]}
                >
                  {item.completed && (
                    <Feather name="check" size={14} color="#fff" />
                  )}
                </View>
                <View style={styles.todoContent}>
                  <Text
                    style={[
                      styles.todoText,
                      item.completed && styles.todoTextCompleted,
                    ]}
                  >
                    {item.text}
                  </Text>
                  <Text style={styles.todoDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteTodo(item.id)}
                >
                  <Feather name="trash-2" size={16} color={COLORS.danger} />
                </TouchableOpacity>
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '600',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
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
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 999,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 12,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: COLORS.surfaceSoft,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  todoTextCompleted: {
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  todoDate: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  separator: {
    height: 8,
  },
});