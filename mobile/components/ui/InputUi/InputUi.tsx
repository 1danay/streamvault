import { View, Text } from "react-native";
import React from "react";
import { observer } from "mobx-react-lite";
import { InputUiProps } from "./types";

export const InputUi = observer(({ label, placeholder }: InputUiProps) => {
  return (
    <View>
      <Text>InputUi</Text>
    </View>
  );
});
