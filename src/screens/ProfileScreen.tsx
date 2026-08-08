import { getAuth } from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { signOutUser } from "../services/authService";
import { getUserProfile } from "../services/firestoreService";
import type { UserProfile } from "../types/user";
import { getInitials } from "../utils/formatters";

export interface ProfileScreenProps {
  onBack?: () => void;
  onSignedOut?: () => void;
}

export function ProfileScreen({ onBack, onSignedOut }: ProfileScreenProps) {
  const currentUser = getAuth().currentUser;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!currentUser) {
      setLoading(false);
      return;
    }

    getUserProfile(currentUser.uid)
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
        }
      })
      .catch((error) => {
        console.error("[Profile] No se pudo cargar el perfil:", error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOutUser();
      onSignedOut?.();
    } catch (error) {
      console.error("[Profile] Falló el cierre de sesión:", error);
    } finally {
      setSigningOut(false);
    }
  }

  const displayName = profile?.name ?? currentUser?.displayName ?? "";

  return (
    <View className="flex-1 bg-white">
      <Header />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <Pressable onPress={onBack} className="mb-4 self-start">
          <Text className="font-roboto-slab-bold text-sm text-brand-tertiary">‹ Back</Text>
        </Pressable>

        <View className="items-center" style={{ gap: 12 }}>
          <Avatar initials={getInitials(displayName)} size={72} />
          <Text className="font-roboto-slab-bold text-xl text-brand-primary">
            {displayName || "—"}
          </Text>
        </View>

        <View className="mt-8" style={{ gap: 16 }}>
          <View>
            <Text className="font-roboto-slab-bold text-sm text-brand-primary">Email</Text>
            <Text className="mt-1 font-roboto-slab text-base text-brand-tertiary">
              {profile?.email ?? currentUser?.email ?? "—"}
            </Text>
          </View>
          <View>
            <Text className="font-roboto-slab-bold text-sm text-brand-primary">Phone</Text>
            <Text className="mt-1 font-roboto-slab text-base text-brand-tertiary">
              {loading ? "…" : profile?.phone ?? "—"}
            </Text>
          </View>
          <View>
            <Text className="font-roboto-slab-bold text-sm text-brand-primary">Role</Text>
            <Text className="mt-1 font-roboto-slab text-base capitalize text-brand-tertiary">
              {loading ? "…" : profile?.role ?? "—"}
            </Text>
          </View>
        </View>

        <Button
          size="lg"
          fullWidth
          className="mt-10"
          loading={signingOut}
          onPress={handleSignOut}
        >
          Log out
        </Button>
      </ScrollView>
    </View>
  );
}
