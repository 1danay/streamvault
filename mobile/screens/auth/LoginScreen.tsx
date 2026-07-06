import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import AuthForm from "@/components/ui/AuthForm/AuthForm";
import MainText from "@/components/ui/TextUi/MainText";
import SecondaryText from "@/components/ui/TextUi/SecondaryText";

export default function LoginPage() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={s.formContainer}>
      <MainText style={{ alignSelf: "flex-start" }}>Вход</MainText>
      <SecondaryText>Войдите или зарегистрируйтесь</SecondaryText>

      <AuthForm />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 40,
  },
});
