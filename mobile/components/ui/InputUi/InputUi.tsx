import { View, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { InputUiProps } from "./types";
import SecondaryText from "../TextUi/SecondaryText";

export const InputUi = observer(({ label, ...props }: InputUiProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <View style={s.fieldWrapper}>
      {label ? <SecondaryText>{label}</SecondaryText> : null}

      <TextInput
        placeholder={label}
        onChangeText={props.onChangeText}
        style={s.inputContainer}
        {...props}
      />
    </View>
  );
});

const s = StyleSheet.create({
  fieldWrapper: {
    width: "100%",
    marginBottom: 10,
  },

  inputContainer: {
    width: "100%",
    paddingVertical: 20,
    borderWidth: 0.5,
  },
});
