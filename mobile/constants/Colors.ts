import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const DarkThemeUi = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#171717",
    card: "#171717",
    text: "#ffffff",
    secondaryText: "#9CA3AF",
    primary: "#227D57",
    tint: "#29BE7D",
  },
};

export const LightThemeUi = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff",
    card: "#f0f0f0",
    text: "#171717",
    secondaryText: "#6B7280",
    primary: "#227D57",
    tint: "#29BE7D",
  },
};
