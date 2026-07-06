import { useColorScheme } from "react-native";
import { DarkThemeUi, LightThemeUi } from "@/constants/Colors";

export function useAppTheme() {
  const scheme = useColorScheme();
  return scheme === "dark" ? DarkThemeUi : LightThemeUi;
}
