import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { InputUi } from "../InputUi/InputUi";
import { ButtonUi } from "../ButtonUi/ButtonUi";
import SecondaryText from "../TextUi/SecondaryText";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import { authStore } from "@/stores/auth";
import Toast from "react-native-toast-message";
import { observer } from "mobx-react-lite";

export const AuthForm = observer(({ mode }: { mode: "register" | "login" }) => {
  const { colors } = useAppTheme();
  const { isSubmitting } = authStore;

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onButtonPress = async () => {
    try {
      if (mode === "login") {
        await authStore.login(email, password);
      } else {
        await authStore.register(username, email, password);
      }

      router.replace("/(tabs)");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: err instanceof Error ? err.message : "Ошибка",
      });
    }
  };
  const onSwitchModePress = () => {
    router.push(mode === "login" ? "/auth/register" : "/auth/login");
  };

  return (
    <>
      {mode === "register" && (
        <InputUi value={username} onChangeText={setUsername} label="Имя" />
      )}

      <InputUi value={email} onChangeText={setEmail} label="Email" />

      <InputUi
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        label="Пароль"
      />

      <ButtonUi onPress={onButtonPress} isLoading={isSubmitting}>
        {mode === "login" ? "Войти" : "Зарегистрироваться"}
      </ButtonUi>

      <View
        style={{
          flexDirection: "row",
          gap: 6,
          marginTop: 16,
          justifyContent: "center",
        }}
      >
        <SecondaryText>
          {mode === "login" ? "Ещё нет аккаунта?" : "Уже есть аккаунт?"}
        </SecondaryText>
        <TouchableOpacity onPress={onSwitchModePress}>
          <Text style={{ color: colors.tint }}>
            {mode === "login" ? "Зарегистрироваться" : "Войти"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
});
