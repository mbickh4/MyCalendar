// app/_layout.tsx - COMPLETE FIX WITH PROPER PERSISTENCE
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { Stack, router, useSegments } from 'expo-router';
import authService from '../services/authService';
import { useEventStore } from '../stores/eventStore';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const segments = useSegments();
  const store = useEventStore();

  useEffect(() => {
    let mounted = true;
    
    // Handle auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (!mounted) return;
      
      console.log('🔐 Auth state changed:', firebaseUser?.uid || 'no user');
      
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Set user in store
        store.setUser(firebaseUser);
        
        // Clear previous data first
        store.clearEvents();
        store.clearTodos();
        
        // Load user data with retries
        const loadUserData = async (retries = 3) => {
          for (let i = 0; i < retries; i++) {
            try {
              console.log(`📥 Loading user data (attempt ${i + 1}/${retries})...`);
              
              // Load events and todos in parallel
              const [eventsResult, todosResult] = await Promise.all([
                store.loadEvents(),
                store.loadTodos()
              ]);
              
              console.log('✅ Data loaded successfully');
              console.log(`📊 Events: ${store.events.length}, Todos: ${store.todos.length}`);
              
              setDataLoaded(true);
              break; // Success, exit retry loop
            } catch (error) {
              console.error(`❌ Error loading data (attempt ${i + 1}):`, error);
              
              if (i === retries - 1) {
                // Last attempt failed
                console.error('⚠️ Failed to load data after all retries');
                // Still proceed to app, data will be empty
                setDataLoaded(true);
              } else {
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          }
        };
        
        await loadUserData();
      } else {
        // User logged out
        store.setUser(null);
        store.clearAllData();
        setDataLoaded(false);
      }
      
      setInitializing(false);
    });

    // Cleanup
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []); // Empty deps - only run once

  // Navigation effect
  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Not logged in and not on auth screen
      console.log('🔄 Redirecting to auth...');
      router.replace('/auth');
    } else if (user && inAuthGroup) {
      // Logged in but still on auth screen
      console.log('🔄 Redirecting to home...');
      router.replace('/(tabs)');
    }
  }, [user, initializing, segments]);

  // Show loading while initializing
  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#020617',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={{ color: '#E5E7EB', marginTop: 16, fontSize: 16 }}>
          Initializing...
        </Text>
      </View>
    );
  }

  // Show loading while fetching user data
  if (user && !dataLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#020617',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={{ color: '#E5E7EB', marginTop: 16, fontSize: 16 }}>
          Loading your data...
        </Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen 
        name="auth" 
        options={{ 
          headerShown: false,
          animation: 'fade' 
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="add-event" 
        options={{ 
          presentation: 'modal',
          headerTitle: 'Add Event',
          headerStyle: {
            backgroundColor: '#020617',
          },
          headerTintColor: '#E5E7EB',
        }} 
      />
    </Stack>
  );
}