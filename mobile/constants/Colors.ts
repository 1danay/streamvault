import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const DarkThemeUi = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#171717",
    card: "#171717",
    text: "#ffffff",
    primary: "#f4511e",
  },
};

export const LightThemeUi = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff",
    card: "#f0f0f0",
    text: "#171717",
    primary: "#f4511e",
  },
};
