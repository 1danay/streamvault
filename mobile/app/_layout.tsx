import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar, useColorScheme, View } from "react-native";
import { DarkThemeUi, LightThemeUi } from "@/constants/Colors";
import { ThemeProvider } from "@react-navigation/native";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/auth";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

const RootLayout = observer(() => {
  const { loadTokens } = authStore;
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadTokens()
      .then(() => {
        SplashScreen.hideAsync();
      })
      .catch((err) => {
        console.error("[auth] loadTokens failed:", err);
        SplashScreen.hideAsync();
      });
  }, [loadTokens]);

  useEffect(() => {
    if (!authStore.isLoading) {
      SplashScreen.hideAsync();
    }
  }, [authStore.isLoading]);

  const currentTheme = colorScheme === "dark" ? DarkThemeUi : LightThemeUi;

  console.log("CURRENT THEME: ", colorScheme);

  return (
    <ThemeProvider value={currentTheme}>
      <StatusBar backgroundColor="#171717" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: currentTheme.colors.background },
        }}
      />

      <Toast />
    </ThemeProvider>
  );
});

export default RootLayout;
