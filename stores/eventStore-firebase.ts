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
  addEvent: (event: Omit<EventItem, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<EventItem>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleEventComplete: (id: string) => Promise<void>;
  loadEvents: () => Promise<void>;
  subscribeToEvents: () => () => void;

  // Todos
  todos: TodoItem[];
  loadingTodos: boolean;
  addTodo: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<TodoItem>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  loadTodos: () => Promise<void>;
  subscribeToTodos: () => () => void;

  // Selected Date
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const useEventStore = create<AppStore>((set, get) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),
  
  // Events
  events: [],
  loadingEvents: false,
  
  addEvent: async (event) => {
    const result = await dataService.addEvent(event);
    if (result.success) {
      // Reload events or add optimistically
      await get().loadEvents();
    }
  },
  
  updateEvent: async (id, updates) => {
    await dataService.updateEvent(id, updates);
    await get().loadEvents();
  },
  
  deleteEvent: async (id) => {
    await dataService.deleteEvent(id);
    set((state) => ({
      events: state.events.filter((e) => e.id !== id)
    }));
  },
  
  toggleEventComplete: async (id) => {
    const event = get().events.find((e) => e.id === id);
    if (event) {
      await dataService.updateEvent(id, { completed: !event.completed });
      await get().loadEvents();
    }
  },
  
  loadEvents: async () => {
    set({ loadingEvents: true });
    const result = await dataService.getUserEvents();
    if (result.success) {
      set({ 
        events: result.events as EventItem[],
        loadingEvents: false 
      });
    } else {
      set({ loadingEvents: false });
    }
  },
  
  subscribeToEvents: () => {
    return dataService.subscribeToEvents((events) => {
      set({ events: events as EventItem[] });
    });
  },

  // Todos
  todos: [],
  loadingTodos: false,
  
  addTodo: async (todo) => {
    const result = await dataService.addTask({
      text: todo.text,
      completed: todo.completed
    });
    if (result.success) {
      await get().loadTodos();
    }
  },
  
  updateTodo: async (id, updates) => {
    await dataService.updateTask(id, updates);
    await get().loadTodos();
  },
  
  deleteTodo: async (id) => {
    await dataService.deleteTask(id);
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id)
    }));
  },
  
  toggleTodo: async (id) => {
    const todo = get().todos.find((t) => t.id === id);
    if (todo) {
      await dataService.updateTask(id, { completed: !todo.completed });
      await get().loadTodos();
    }
  },
  
  loadTodos: async () => {
    set({ loadingTodos: true });
    const result = await dataService.getUserTasks();
    if (result.success) {
      const formattedTodos = result.tasks.map(task => ({
        id: task.id!,
        text: task.text,
        completed: task.completed,
        createdAt: task.createdAt
      }));
      set({ 
        todos: formattedTodos,
        loadingTodos: false 
      });
    } else {
      set({ loadingTodos: false });
    }
  },
  
  subscribeToTodos: () => {
    return dataService.subscribeToTasks((tasks) => {
      const formattedTodos = tasks.map(task => ({
        id: task.id!,
        text: task.text,
        completed: task.completed,
        createdAt: task.createdAt
      }));
      set({ todos: formattedTodos });
    });
  },

  // Selected Date
  selectedDate: new Date().toISOString().split('T')[0],
  setSelectedDate: (date) => set({ selectedDate: date }),
}));