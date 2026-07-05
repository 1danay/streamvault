import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export function LoginPromptView() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Войдите или зарегистрируйтесь</Text>
      <Button title="Войти" onPress={() => router.push("/auth/login")}></Button>
    </View>
  );
}
