import React from "react";
import { TextProps } from "react-native";

export type TextVariant = "secondary" | "tint";

export interface TextUiProps extends TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  px?: number;
}
