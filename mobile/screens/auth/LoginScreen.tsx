import { View, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthForm from "@/components/ui/AuthForm/AuthForm";
import MainText from "@/components/ui/TextUi/MainText";
import SecondaryText from "@/components/ui/TextUi/SecondaryText";

export default function LoginScreen() {
  return (
    <SafeAreaView style={s.formContainer}>
      <View style={s.header}>
        <MainText>Вход</MainText>
        <SecondaryText>Войдите или зарегистрируйтесь</SecondaryText>
      </View>

      <AuthForm mode="login" />
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
