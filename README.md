# Barber Shop

Barber Shop is a mobile appointment-booking app built with React Native and Expo. It gives clients a simple way to browse services, choose a barber, find an available time, and request an appointment. Barber and client accounts can also view their upcoming reservations from a role-aware home screen.

## Favorite Quotes

**Tracy Catherine Nalubwama**

> "Happy mind Happy Life"

**Jonatan Troche Almedia**

> "The only way to do a great job is livig what do you do." - Steve Jobs

**Madison Darger Thomas**

> "The most important step a person can take is always the next one."

## Features

- Register and sign in with email and password
- Sign in with Google
- Create client and barber profiles
- Browse barber services and view prices and durations
- Choose a barber and view available appointments by week or month
- Filter unavailable time slots with real-time schedule updates
- Review an order before requesting an appointment
- View upcoming reservations and their pending, approved, or declined status
- View profile details and sign out

## Tech Stack

- [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- TypeScript
- Firebase Authentication and Cloud Firestore
- NativeWind and Tailwind CSS
- `date-fns` for date and schedule utilities
- Expo Application Services (EAS) for development and production builds

## Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) and npm
- [Android Studio](https://developer.android.com/studio) with an Android emulator, or a physical Android device with USB debugging enabled
- Java Development Kit (JDK) 17

Because this app uses native Firebase and Google Sign-In modules, it must run in a native development build; it is not compatible with Expo Go.

### Installation

1. Clone the repository and enter the project directory.

   ```bash
   git clone <repository-url>
   cd Barber-Shop-
   ```

2. Install the dependencies.

   ```bash
   npm install
   ```

3. Confirm that the Android Firebase configuration file is available at `google-services.json`. If you connect the app to a different Firebase project, replace this file and update the Firebase/Google Sign-In configuration for that project.

4. Build and launch the Android development app.

   ```bash
   npm run android
   ```

5. For later sessions, start the Expo development server and open the installed development build.

   ```bash
   npm start
   ```

## Available Scripts

| Command           | Description                                                                           |
| ----------------- | ------------------------------------------------------------------------------------- |
| `npm start`       | Start the Expo development server                                                     |
| `npm run android` | Build and run the native Android app                                                  |
| `npm run ios`     | Build and run the native iOS app (requires macOS and iOS Firebase configuration)      |
| `npm run web`     | Start Expo for the web; native Firebase features may require additional configuration |

## Firebase Data

The app uses Firebase Authentication for account access and Cloud Firestore for application data. Its primary collections are:

- `users` — client and barber account profiles
- `barberProfile` — additional barber profile information
- `services` — bookable services, descriptions, durations, and prices
- `appointments` — requested bookings, assigned barbers, times, services, prices, and statuses

Firebase configuration files can identify a project and are commonly committed for mobile apps, but access must still be protected with appropriate Firebase Authentication settings and Firestore security rules. Do not commit service-account keys or other administrative credentials.

## Project Structure

```text
.
├── assets/                 # App icons, splash art, and images
├── src/
│   ├── components/         # Reusable UI and booking controls
│   ├── mocks/              # Service and development sample data
│   ├── navigation/         # App view definitions
│   ├── screens/            # Authentication and main app screens
│   ├── services/           # Firebase authentication and data access
│   ├── theme/              # Colors and typography
│   ├── types/              # Shared TypeScript types
│   └── utils/              # Date, schedule, formatting, and validation helpers
├── App.tsx                 # Root app state and screen routing
├── app.json                # Expo application configuration
└── package.json            # Dependencies and npm scripts
```

## Current Development Notes

- Services are loaded from the Firestore `services` collection.
- Business hours are currently defined in the app as 9:00 a.m. to 5:00 p.m.
- Appointment records and barber availability are stored in Firestore.
- New appointment requests begin with a `pending` status.
- Automated test and lint scripts have not yet been added to `package.json`.
