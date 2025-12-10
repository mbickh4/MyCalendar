
# MyCalendar

A modern cross-platform calendar and task management mobile app built with React Native, Expo Router, Zustand, Firebase Authentication, and Firestore.

---

## 🚀 Features

✅ User authentication (sign up & login)  
✅ Cloud-persisted events and tasks  
✅ Interactive calendar  
✅ Task management system  
✅ Priority labeling  
✅ Dashboard analytics  
✅ Firebase-powered backend  
✅ Clean modern UI  

---

## 🛠️ Tech Stack

- React Native (Expo)
- Expo Router (navigation)
- Zustand (state management)
- Firebase Auth (authentication)
- Firebase Firestore (database)
- react-native-calendars
- expo-linear-gradient
- @expo/vector-icons

---

## 📂 Folder Structure

/
├── app/
├── stores/
├── services/
└── assets/

yaml
Copy code

---

## ✅ Prerequisites

Before installing anything, make sure you have:

### 1. Node.js (Required)
Download from:  
https://nodejs.org/

Verify installation:

```bash
node -v
npm -v
2. Install Expo CLI
bash
Copy code
npm install -g expo-cli
📦 Install Project Dependencies
From the project root, run:

1. Install Expo & Core Packages
bash
Copy code
npx expo install react react-native expo


2. Install Expo Router
bash
Copy code
npx expo install expo-router react-native-screens react-native-safe-area-context


3. Install Firebase SDK
bash
Copy code
npm install firebase


4. Install Zustand (State Management)
bash
Copy code
npm install zustand
5. Install UI Libraries
bash
Copy code
npx expo install react-native-calendars
npx expo install expo-linear-gradient
npx expo install @expo/vector-icons


##☁️ Firebase Setup
1. Create Firebase Project
Go to:
https://console.firebase.google.com

2. Enable Email Authentication
mathematica
Copy code
Authentication → Sign-in Method → Email/Password → Enable
3. Create Firestore Database
pgsql
Copy code
Firestore Database → Create Database → Production Mode
4. Add Firebase Config
Create .env in root directory:

env
Copy code
FIREBASE_API_KEY=your-key-here
FIREBASE_AUTH_DOMAIN=your-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-bucket
FIREBASE_MESSAGING_SENDER_ID=your-id
FIREBASE_APP_ID=your-app-id


##▶️ Running the App
From the project root directory:

bash
Copy code
npx expo start
OR (if Expo CLI is installed globally):

bash
Copy code
expo start


##📱 Run on Device
iOS
bash
Copy code
i
Android
bash
Copy code
a
Web
bash
Copy code
w


##🧠 Architecture Overview
scss
Copy code
UI (app/)
   ↓
Global State (stores/)
   ↓
Firebase Adapter (eventStore-firebase.ts)
   ↓
Firestore Database

Auth Flow:
Auth Screen → authService.ts → Firebase Auth


##🧪 Development Tips
Clear Expo cache:

bash
Copy code
npx expo start --clear
Restart Metro:

bash
Copy code
r
