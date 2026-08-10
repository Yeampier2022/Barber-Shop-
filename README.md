# CorteListo (Barber App)

A React Native (Expo) app for booking appointments at a barber shop. Users can browse services and barbers, pick a date and time, and manage their bookings. Data is stored in Firebase Firestore, and authentication is handled with Firebase Auth / Google Sign-In.

## Favourite Quotes

**Tracy Catherine Nalubwama**
> "Happy mind, happy life"

**Yeampier Huerta**
> "The only true wisdom is knowing you know nothing; life moves pretty fast, so keep moving"

**Jonatan Troche Almedia**
> "The only way to do a great job is living what you do." - Steve Jobs

**Madison Darger Thomas**
> "The most important step a person can take is always the next one."

## Features

- Sign up / log in with email or Google Sign-In (Firebase Auth).
- Browse barbers and services.
- Book an appointment with name, phone number, service, barber, date, and time.
- Appointments are saved to and read from Firebase Firestore in real time.
- View and manage upcoming bookings from the profile/appointments screen.
- Local push notifications for appointment reminders (`expo-notifications`).

## Tech Stack

- [Expo](https://expo.dev) / React Native 0.81 + React 19
- TypeScript
- NativeWind (Tailwind CSS for React Native)
- Firebase (`@react-native-firebase/app`, `auth`, `firestore`)
- Google Sign-In (`@react-native-google-signin/google-signin`)

## Project Structure

```
CorteListo/
├── App.tsx                  # App entry point / root component
├── app.json                 # Expo app configuration
├── firebaseConfig.ts        # Firebase initialization (not committed, see below)
├── google-services.json     # Firebase Android config
├── src/
│   ├── components/          # Reusable UI components (buttons, inputs, cards, etc.)
│   ├── mocks/                # Local mock data used during development
│   ├── navigation/           # App and auth navigators
│   ├── screens/               # App screens (Home, Login, Register, Services, Appointments, Profile)
│   ├── services/               # Firebase/auth/notification service wrappers
│   ├── theme/                   # Colors and fonts
│   ├── types/                    # Shared TypeScript types
│   └── utils/                     # Date, formatting, schedule, and validation helpers
└── assets/                    # App icons, splash screen, images
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later and npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (installed automatically via `npx`)
- The [Expo Go](https://expo.dev/client) app on your phone, **or** Android Studio / Xcode with an emulator/simulator set up
- A Firebase project (only required if you want to connect to your own backend instead of the one already configured)

## Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/Yeampier2022/CorteListo.git
   cd CorteListo
   npm install
   ```

   > If `npm install` fails, try updating npm or run `npm install --legacy-peer-deps`.

2. Firebase configuration:

   - `firebaseConfig.ts` is excluded from version control (see `.gitignore`) because it contains project credentials. Request this file from the project owner, or create your own by copying the template below and filling in your Firebase project's values from the [Firebase Console](https://console.firebase.google.com/):

     ```ts
     // firebaseConfig.ts
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT.firebasestorage.app",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID",
     };
     ```

   - For native Android builds, also place your project's `google-services.json` in the repository root (and `android/app/` if you have generated the native project).

## Running the App

Start the Metro bundler:

```bash
npm start
```

Then choose a platform:

```bash
npm run android   # Run on a connected device/emulator (requires Android build tools)
npm run ios       # Run on an iOS simulator (macOS only)
npm run web       # Run in a browser
```

Alternatively, once `npm start` is running, scan the QR code with the **Expo Go** app on your phone to preview the app without a native build.

> Note: this project uses native Firebase modules (`@react-native-firebase/*`), which require a **development build** (`expo-dev-client`) rather than the standard Expo Go client for full functionality. If you see errors related to native Firebase modules in Expo Go, run `npx expo run:android` (or `run:ios`) to build a development client.

## Building

This project is configured with [EAS Build](https://docs.expo.dev/build/introduction/) (`eas.json`). To create a build:

```bash
npx eas-cli build --platform android --profile preview
```

## Credentials

This app does not require a login for reviewers by default — accounts can be created directly from the Register screen. If specific test credentials are required for grading/review, they are listed in the submission worksheet rather than in this repository.
