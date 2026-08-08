import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getUserProfile } from "./firestoreService";

export async function registerForPushNotifications(): Promise<string | null> {
  try {
    const existing = await Notifications.getPermissionsAsync();
    let granted = existing.granted;

    if (!granted) {
      const requested = await Notifications.requestPermissionsAsync();
      granted = requested.granted;
    }

    if (!granted) {
      console.log("[Notifications] Permission not granted");
      return null;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    console.log("[Notifications] Expo push token:", token);

    return token;
  } catch (error) {
    console.error("[Notifications] Could not register for push notifications:", error);
    return null;
  }
}

async function sendPushNotification(
  pushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: pushToken, title, body, data }),
    });
    const result = await response.json();
    console.log("[Notifications] Push send result:", result);
    return result;
  } catch (error) {
    console.error("[Notifications] Could not send push notification:", error);
    return null;
  }
}

// Looks up the recipient's saved pushToken (users/{uid}) and sends to it.
// No-ops (with a log) if they don't have one yet — e.g. never opened the app
// on a device, or denied notification permission.
export async function notifyUser(
  uid: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  const profile = await getUserProfile(uid);
  if (!profile?.pushToken) {
    console.log(`[Notifications] No push token for ${uid}, skipping notification`);
    return;
  }

  await sendPushNotification(profile.pushToken, title, body, data);
}
