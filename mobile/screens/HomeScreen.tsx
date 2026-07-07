import ScreenWrapper from "@/components/ui/ScreenWrapperUi";
import { StyleSheet, Text, View } from "react-native";

export default function HomePage() {
  return (
    <ScreenWrapper
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>StreamVault</Text>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  container: {},
});
