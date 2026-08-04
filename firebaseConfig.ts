import { Platform } from 'react-native';

let firebaseAuth: any = null;
let db: any = null;

const firebaseConfig = {
  apiKey: "AIzaSyAy4pwC6bgZCJ0QkqbjPR-OMRMQdHHulV0",
  authDomain: "barber-629c0.firebaseapp.com",
  projectId: "barber-629c0",
  storageBucket: "barber-629c0.firebasestorage.app",
  messagingSenderId: "118262159405",
  appId: "1:118262159405:android:f891031447c0c4512100a4",
};

const firestoreProjectBaseUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)`;

function parseFirestoreValue(value: any): any {
  if (!value || typeof value !== 'object') {
    return null;
  }

  if ('stringValue' in value) {
    return value.stringValue;
  }

  if ('timestampValue' in value) {
    return new Date(value.timestampValue);
  }

  if ('integerValue' in value) {
    return Number(value.integerValue);
  }

  if ('doubleValue' in value) {
    return Number(value.doubleValue);
  }

  if ('booleanValue' in value) {
    return value.booleanValue;
  }

  if ('mapValue' in value) {
    return Object.fromEntries(
      Object.entries(value.mapValue.fields || {}).map(([key, nestedValue]) => [key, parseFirestoreValue(nestedValue)])
    );
  }

  if ('arrayValue' in value) {
    return (value.arrayValue.values || []).map(parseFirestoreValue);
  }

  return null;
}

function toFirestoreValue(value: any): any {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }

  if (typeof value === 'string') {
    return { stringValue: value };
  }

  if (typeof value === 'boolean') {
    return { booleanValue: value };
  }

  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { integerValue: value.toString() }
      : { doubleValue: value };
  }

  if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  }

  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }

  if (typeof value === 'object') {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value).map(([key, nestedValue]) => [key, toFirestoreValue(nestedValue)])
        ),
      },
    };
  }

  return { stringValue: String(value) };
}

function transformFirestoreDocument(document: any) {
  return {
    id: document.name.split('/').pop(),
    ...Object.fromEntries(
      Object.entries(document.fields || {}).map(([key, value]) => [key, parseFirestoreValue(value)])
    ),
  };
}

function createWebFirestoreCollection(collectionName: string) {
  const collectionUrl = `${firestoreProjectBaseUrl}/documents/${collectionName}`;

  return {
    orderBy: (field: string, direction = 'asc') => {
      const queryDirection = direction.toUpperCase();

      return {
        async get() {
          const response = await fetch(`${firestoreProjectBaseUrl}/documents:runQuery?key=${firebaseConfig.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              structuredQuery: {
                from: [{ collectionId: collectionName }],
                orderBy: [
                  {
                    field: { fieldPath: field },
                    direction: queryDirection,
                  },
                ],
              },
            }),
          });

          if (!response.ok) {
            throw new Error(`Firestore REST query failed: ${response.status} ${response.statusText}`);
          }

          const result = await response.json();
          return {
            docs: result
              .filter((item: any) => item.document)
              .map((item: any) => transformFirestoreDocument(item.document)),
          };
        },
        onSnapshot(callback: any, errorCallback: any) {
          this.get()
            .then(callback)
            .catch(errorCallback);
          return () => {};
        },
      };
    },
    async add(data: any) {
      const response = await fetch(`${collectionUrl}?key=${firebaseConfig.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, toFirestoreValue(value)])
          ),
        }),
      });

      if (!response.ok) {
        throw new Error(`Firestore REST add failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
  };
}

if (Platform.OS === 'web') {
  db = {
    collection: createWebFirestoreCollection,
  };
} else {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const app = require('@react-native-firebase/app');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const auth = require('@react-native-firebase/auth');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const firestore = require('@react-native-firebase/firestore');

    if (app && app.initializeApp) {
      app.initializeApp(firebaseConfig);
    }

    firebaseAuth = auth && auth.default ? auth.default() : (auth && auth()) || null;
    db = firestore && firestore.default ? firestore.default() : (firestore && firestore()) || null;
  } catch (e) {
    db = {
      collection: () => ({
        orderBy: () => ({
          onSnapshot: (_: any, __: any) => () => {},
        }),
        add: async () => {
          throw new Error('Firestore is not available in this environment');
        },
      }),
    };
    firebaseAuth = null;
  }
}

export { firebaseAuth, db };
