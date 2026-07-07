import { authStore } from "@/stores/auth";
import { observer } from "mobx-react-lite";
import { LoginPromptView } from "./LoginPromptView";
import { View, Text } from "react-native";
import ProfileView from "./ProfileView";
import ScreenWrapper from "@/components/ui/ScreenWrapperUi";

const ProfileScreen = observer(() => {
  return (
    <ScreenWrapper>
      {authStore.accessToken ? <ProfileView /> : <LoginPromptView />}
    </ScreenWrapper>
  );
});

export default ProfileScreen;
