declare module '@react-native-firebase/app';
declare module '@react-native-firebase/auth';
declare module '@react-native-firebase/firestore';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
}

export {};

declare module 'react' {
  namespace JSX {
    interface IntrinsicAttributes {
      className?: string;
    }
  }
}
