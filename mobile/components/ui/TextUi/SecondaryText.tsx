import { View, Text } from "react-native";
import React from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { TextUiProps } from "./types";

export default function SecondaryText({
  style,
  children,
  variant = "secondary",
  px = 14,
}: TextUiProps) {
  const { colors } = useAppTheme();

  const colorMap = {
    secondary: colors.secondaryText,
    tint: colors.tint,
  };

  return (
    <View>
      <Text
        style={[
          {
            color: colorMap[variant],
            fontWeight: "600",
            fontSize: px,
          },
          style,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}
