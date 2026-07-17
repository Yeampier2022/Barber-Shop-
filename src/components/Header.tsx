import { ReactNode } from "react";
import { Image, View, ViewProps } from "react-native";
import { cn } from "../utils/cn";
import { Avatar } from "./Avatar";
import { ButtonColor } from "./Button";

export interface HeaderProps extends ViewProps {
  isAuthenticated?: boolean;
  /** Initials shown in the right-side avatar when isAuthenticated is true. */
  userInitials?: string;
  avatarColor?: ButtonColor;
  onAvatarPress?: () => void;
  /** Overrides the default text logo on the left with anything you want. */
  logo?: ReactNode;
  /** Overrides the entire right side, regardless of auth state. */
  rightContent?: ReactNode;
  className?: string;
}

export function Header({
  isAuthenticated = false,
  userInitials,
  avatarColor = "primary",
  onAvatarPress,
  logo,
  rightContent,
  className,
  ...viewProps
}: HeaderProps) {
  return (
    <View
      className={cn(
        "flex-row items-center justify-between bg-white px-4 py-3",
        className
      )}
      {...viewProps}
    >
      <View className="flex-row items-center">
        {logo ?? (
          <Image
            source={require("../../assets/hombre.png")}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        )}
      </View>

      <View className="flex-row items-center">
        {rightContent ??
          (isAuthenticated && userInitials ? (
            <Avatar initials={userInitials} color={avatarColor} onPress={onAvatarPress} />
          ) : null)}
      </View>
    </View>
  );
}
