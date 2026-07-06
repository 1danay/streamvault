import { View, Text } from "react-native";
import React from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { TextUiProps } from "./types";

export default function MainText({ style, children, px = 48 }: TextUiProps) {
  const { colors } = useAppTheme();

  return (
    <View>
      <Text
        style={[
          { color: colors.text, fontWeight: "bold", fontSize: px },
          style,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}
