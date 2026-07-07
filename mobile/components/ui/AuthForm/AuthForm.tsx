import React, { useState } from "react";
import { InputUi } from "../InputUi/InputUi";

export default function AuthForm() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
    </>
  );
}
