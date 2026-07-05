import React from "react";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  return (
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
  );
}
