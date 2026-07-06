import React from "react";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <Label>Главная</Label>
          <Icon sf="house.fill" drawable="ic_home" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="profile">
          <Label>Профиль</Label>
          <Icon sf="person.crop.circle.fill" drawable="ic_account_circle" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
