import { View, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { InputUiProps } from "./types";
import SecondaryText from "../TextUi/SecondaryText";

export const InputUi = observer(
  ({ label, onFocus, onBlur, ...props }: InputUiProps) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);

    return (
      <View style={s.fieldWrapper}>
        {label ? <SecondaryText>{label}</SecondaryText> : null}

        <TextInput
          placeholder={label}
          placeholderTextColor="#5c5c66"
          selectionColor="#FFFFFF"
          onChangeText={props.onChangeText}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          style={[s.inputContainer, isFocused && s.inputFocused]}
          {...props}
        />
      </View>
    );
  },
);

const s = StyleSheet.create({
  fieldWrapper: {
    width: "100%",
    paddingVertical: 8,
  },
  inputContainer: {
    width: "100%",
    height: 48,
    backgroundColor: "#1c1c22",
    borderWidth: 1,
    borderColor: "#2a2a33",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#fff",
  },
  inputFocused: {
    borderColor: "#4ade80",
    backgroundColor: "#1f1f26",
  },
});
