import { authStore } from "@/stores/auth";
import { observer } from "mobx-react-lite";
import { LoginPromptView } from "./LoginPromptView";
import { View, Text } from "react-native";
import ProfileView from "./ProfileView";

const ProfileScreen = observer(() => {
  return authStore.accessToken ? <ProfileView /> : <LoginPromptView />;
});

export default ProfileScreen;
