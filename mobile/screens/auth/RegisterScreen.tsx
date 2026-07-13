import { StyleSheet, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MainText from "@/components/ui/TextUi/MainText";
import SecondaryText from "@/components/ui/TextUi/SecondaryText";
import { AuthForm } from "@/components/ui/AuthForm";

export default function LoginScreen() {
  return (
    <SafeAreaView style={s.formContainer}>
      <View style={s.header}>
        <MainText>Регистрация</MainText>
        <SecondaryText>Войдите или зарегистрируйтесь</SecondaryText>
      </View>

      <AuthForm mode="register" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  formContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    gap: 4,
    marginBottom: 10,
  },
});
