import { StyleSheet, Text, View } from "react-native";

export default function HomePage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>StreamVault</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {},
});
