// services/dataService.ts - FIXED VERSION WITHOUT ORDERBY ISSUES
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import authService from './authService';

export interface FirebaseEvent {
  id?: string;
  userId: string;
  title: string;
  date: string;
  notes?: string;
  priority: 'High' | 'Medium' | 'Low' | null;
  completed: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface FirebaseTask {
  id?: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt?: any;
  updatedAt?: any;
}

class DataService {
  // ========== EVENTS ==========
  
  // Add event
  async addEvent(event: Omit<FirebaseEvent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const user = authService.getCurrentUser();
    if (!user) {
      console.error('No user authenticated for addEvent');
      throw new Error('User not authenticated');
    }

    try {
      console.log('Adding event for user:', user.uid, event);
      const docRef = await addDoc(collection(db, 'events'), {
        ...event,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Event added successfully with ID:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('Error adding event:', error);
      return { success: false, error: error.message };
    }
  }

  // Update event
  async updateEvent(eventId: string, updates: Partial<FirebaseEvent>) {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      await updateDoc(doc(db, 'events', eventId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error: any) {
      console.error('Error updating event:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete event
  async deleteEvent(eventId: string) {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user events - FIXED WITHOUT ORDERBY
  async getUserEvents() {
    const user = authService.getCurrentUser();
    if (!user) {
      console.error('No user authenticated for getUserEvents');
      return { success: false, error: 'User not authenticated', events: [] };
    }

    try {
      console.log('Fetching events for user:', user.uid);
      
      // Simple query without orderBy to avoid index issues
      const q = query(
        collection(db, 'events'),
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const events: FirebaseEvent[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Found event:', doc.id, data);
        events.push({ 
          id: doc.id, 
          ...data,
          // Convert Firestore timestamps if needed
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        } as FirebaseEvent);
      });
      
      // Sort events by date in JavaScript instead of Firestore
      events.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });
      
      console.log(`Successfully fetched ${events.length} events`);
      return { success: true, events };
    } catch (error: any) {
      console.error('Error fetching events:', error);
      return { success: false, error: error.message, events: [] };
    }
  }

  // Subscribe to events (real-time) - FIXED WITHOUT ORDERBY
  subscribeToEvents(callback: (events: FirebaseEvent[]) => void) {
    const user = authService.getCurrentUser();
    if (!user) {
      console.error('No user for event subscription');
      return () => {};
    }

    console.log('Setting up event subscription for user:', user.uid);
    
    // Simple query without orderBy
    const q = query(
      collection(db, 'events'),
      where('userId', '==', user.uid)
    );

    return onSnapshot(
      q, 
      (querySnapshot) => {
        const events: FirebaseEvent[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          events.push({ 
            id: doc.id, 
            ...data,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
          } as FirebaseEvent);
        });
        
        // Sort in JavaScript
        events.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA - dateB;
        });
        
        console.log(`Event subscription update: ${events.length} events`);
        callback(events);
      },
      (error) => {
        console.error('Event subscription error:', error);
      }
    );
  }

  // ========== TASKS ==========
  
  // Add task
  async addTask(task: Omit<FirebaseTask, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const user = authService.getCurrentUser();
    if (!user) {
      console.error('No user authenticated for addTask');
      throw new Error('User not authenticated');
    }

    try {
      console.log('Adding task for user:', user.uid, task);
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...task,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Task added successfully with ID:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('Error adding task:', error);
      return { success: false, error: error.message };
    }
  }

  // Update task
  async updateTask(taskId: string, updates: Partial<FirebaseTask>) {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error: any) {
      console.error('Error updating task:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete task
  async deleteTask(taskId: string) {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting task:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user tasks - FIXED WITHOUT ORDERBY
  async getUserTasks() {
    const user = authService.getCurrentUser();
    if (!user) {
      console.error('No user authenticated for getUserTasks');
      return { success: false, error: 'User not authenticated', tasks: [] };
    }

    try {
      console.log('Fetching tasks for user:', user.uid);
      
      // Simple query without orderBy
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const tasks: FirebaseTask[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Found task:', doc.id, data);
        tasks.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        } as FirebaseTask);
      });
      
      // Sort tasks by createdAt in JavaScript (newest first)
      tasks.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA; // Descending order
      });
      
      console.log(`Successfully fetched ${tasks.length} tasks`);
      return { success: true, tasks };
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      return { success: false, error: error.message, tasks: [] };
    }
  }

  // Subscribe to tasks (real-time) - FIXED WITHOUT ORDERBY
  subscribeToTasks(callback: (tasks: FirebaseTask[]) => void) {
    const user = authService.getCurrentUser();
    if (!user) {
      console.error('No user for task subscription');
      return () => {};
    }

    console.log('Setting up task subscription for user:', user.uid);
    
    // Simple query without orderBy
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        const tasks: FirebaseTask[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tasks.push({ 
            id: doc.id, 
            ...data,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
          } as FirebaseTask);
        });
        
        // Sort in JavaScript
        tasks.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
        
        console.log(`Task subscription update: ${tasks.length} tasks`);
        callback(tasks);
      },
      (error) => {
        console.error('Task subscription error:', error);
      }
    );
  }
}

export default new DataService();