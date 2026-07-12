import React, { useState } from "react";
import { InputUi } from "../InputUi/InputUi";
import { ButtonUi } from "../ButtonUi/ButtonUi";

export default function AuthForm({ mode }: { mode: "register" | "login" }) {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onButtonPress = () => {};

  return (
    <>
      <InputUi
        value={username}
        onChangeText={(u) => setUsername(u)}
        label="Имя"
      />

      <InputUi value={email} onChangeText={(e) => setEmail(e)} label="Email" />

      <InputUi
        value={password}
        onChangeText={(p) => setPassword(p)}
        secureTextEntry
        label="Пароль"
      />

      <ButtonUi onPress={onButtonPress}>
        {mode === "login" ? "Войти" : "Зарегистрироваться"}
      </ButtonUi>
    </>
  );
}
