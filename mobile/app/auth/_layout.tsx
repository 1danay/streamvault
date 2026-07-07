import { View, Text, Pressable } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import SecondaryText from "@/components/ui/TextUi/SecondaryText";
import ScreenWrapper from "@/components/ui/ScreenWrapperUi";

export default function AuthLayout() {
  return (
    <ScreenWrapper>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <Pressable onPress={() => router.replace("/")}>
              <SecondaryText variant="tint">К стримам</SecondaryText>
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </ScreenWrapper>
  );
}
