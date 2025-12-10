// stores/eventStore.ts - IMPROVED VERSION WITH BETTER USER HANDLING
import { create } from 'zustand';
import dataService from '../services/dataService';

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  notes?: string;
  priority: 'High' | 'Medium' | 'Low' | null;
  completed: boolean;
};

interface AppStore {
  // Auth
  user: any;
  setUser: (user: any) => void;
  
  // Events
  events: EventItem[];
  loadingEvents: boolean;
  addEvent: (event: EventItem) => Promise<void>;
  updateEvent: (id: string, updates: Partial<EventItem>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleEventComplete: (id: string) => Promise<void>;
  loadEvents: () => Promise<void>;
  clearEvents: () => void;

  // Todos
  todos: TodoItem[];
  loadingTodos: boolean;
  addTodo: (todo: TodoItem) => Promise<void>;
  updateTodo: (id: string, updates: Partial<TodoItem>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  loadTodos: () => Promise<void>;
  clearTodos: () => void;

  // Selected Date
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  
  // Clear all data
  clearAllData: () => void;
}

export const useEventStore = create<AppStore>((set, get) => ({
  user: null,
  setUser: (user) => {
    console.log('Setting user in store:', user?.uid || 'null');
    set({ user });
    if (!user) {
      // Clear data when user logs out
      get().clearAllData();
    }
  },
  
  events: [],
  loadingEvents: false,
  
  addEvent: async (event) => {
    const { id, ...eventData } = event;
    const result = await dataService.addEvent(eventData);
    if (result.success && result.id) {
      const newEvent = { ...event, id: result.id };
      set((state) => ({ events: [...state.events, newEvent] }));
    }
  },
  
  updateEvent: async (id, updates) => {
    const result = await dataService.updateEvent(id, updates);
    if (result.success) {
      set((state) => ({
        events: state.events.map((e) => e.id === id ? { ...e, ...updates } : e)
      }));
    }
  },
  
  deleteEvent: async (id) => {
    const result = await dataService.deleteEvent(id);
    if (result.success) {
      set((state) => ({ events: state.events.filter((e) => e.id !== id) }));
    }
  },
  
  toggleEventComplete: async (id) => {
    const event = get().events.find((e) => e.id === id);
    if (event) {
      await get().updateEvent(id, { completed: !event.completed });
    }
  },
  
  loadEvents: async () => {
    const currentUser = get().user;
    console.log('loadEvents called, user:', currentUser?.uid || 'no user');
    
    if (!currentUser) {
      console.log('No user in store, skipping event load');
      return;
    }
    
    set({ loadingEvents: true });
    
    try {
      const result = await dataService.getUserEvents();
      console.log('Events loaded from Firebase:', result);
      
      if (result.success) {
        const formattedEvents = result.events.map(e => ({
          id: e.id!,
          title: e.title,
          date: e.date,
          notes: e.notes,
          priority: e.priority,
          completed: e.completed
        }));
        
        console.log('Setting events in store:', formattedEvents.length, 'events');
        set({ 
          events: formattedEvents,
          loadingEvents: false 
        });
      } else {
        console.error('Failed to load events:', result.error);
        set({ loadingEvents: false });
      }
    } catch (error) {
      console.error('Error in loadEvents:', error);
      set({ loadingEvents: false });
    }
  },
  
  clearEvents: () => set({ events: [] }),

  todos: [],
  loadingTodos: false,
  
  addTodo: async (todo) => {
    const { id, createdAt, ...todoData } = todo;
    const result = await dataService.addTask({
      text: todoData.text,
      completed: todoData.completed
    });
    if (result.success && result.id) {
      const newTodo = { ...todo, id: result.id, createdAt: new Date().toISOString() };
      set((state) => ({ todos: [...state.todos, newTodo] }));
    }
  },
  
  updateTodo: async (id, updates) => {
    const result = await dataService.updateTask(id, updates);
    if (result.success) {
      set((state) => ({
        todos: state.todos.map((t) => t.id === id ? { ...t, ...updates } : t)
      }));
    }
  },
  
  deleteTodo: async (id) => {
    const result = await dataService.deleteTask(id);
    if (result.success) {
      set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
    }
  },
  
  toggleTodo: async (id) => {
    const todo = get().todos.find((t) => t.id === id);
    if (todo) {
      await get().updateTodo(id, { completed: !todo.completed });
    }
  },
  
  loadTodos: async () => {
    const currentUser = get().user;
    console.log('loadTodos called, user:', currentUser?.uid || 'no user');
    
    if (!currentUser) {
      console.log('No user in store, skipping todos load');
      return;
    }
    
    set({ loadingTodos: true });
    
    try {
      const result = await dataService.getUserTasks();
      console.log('Todos loaded from Firebase:', result);
      
      if (result.success) {
        const formattedTodos = result.tasks.map(task => ({
          id: task.id!,
          text: task.text,
          completed: task.completed,
          createdAt: task.createdAt || new Date().toISOString()
        }));
        
        console.log('Setting todos in store:', formattedTodos.length, 'todos');
        set({ 
          todos: formattedTodos,
          loadingTodos: false 
        });
      } else {
        console.error('Failed to load todos:', result.error);
        set({ loadingTodos: false });
      }
    } catch (error) {
      console.error('Error in loadTodos:', error);
      set({ loadingTodos: false });
    }
  },
  
  clearTodos: () => set({ todos: [] }),

  selectedDate: new Date().toISOString().split('T')[0],
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  clearAllData: () => {
    console.log('Clearing all data from store');
    set({
      events: [],
      todos: [],
      user: null,
      loadingEvents: false,
      loadingTodos: false,
      selectedDate: new Date().toISOString().split('T')[0]
    });
  }
}));