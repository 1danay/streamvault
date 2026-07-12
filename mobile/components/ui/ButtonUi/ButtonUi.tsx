import { useAppTheme } from "@/hooks/useAppTheme";
import { observer } from "mobx-react-lite";
import {
  ButtonProps,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import MainText from "../TextUi/MainText";

interface ButtonUiProps {
  children: React.ReactNode;
  onPress: () => void;
  isLoading?: boolean;
}

export const ButtonUi = observer(
  ({ children, onPress, isLoading = false }: ButtonUiProps) => {
    const { colors } = useAppTheme();

    return (
      <TouchableOpacity
        style={[s.button, { backgroundColor: colors.tint }]}
        onPress={onPress}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <MainText style={s.buttonText}>{children}</MainText>
      </TouchableOpacity>
    );
  },
);

const s = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 20,
  } as ViewStyle,
  buttonText: {
    fontSize: 14,
    letterSpacing: 0.5,
  } as TextStyle,
});
