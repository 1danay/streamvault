import {
  View,
  StyleProp,
  ViewStyle,
  Keyboard,
  StyleSheet,
  Pressable,
} from "react-native";
import React from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={Keyboard.dismiss} />

      <View style={[s.container, style]} pointerEvents="box-none">
        {children}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
});
