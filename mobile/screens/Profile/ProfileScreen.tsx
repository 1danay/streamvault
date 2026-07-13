import { authStore } from "@/stores/auth";
import { observer } from "mobx-react-lite";
import { LoginPromptView } from "./LoginPromptView";
import ScreenWrapper from "@/components/ui/ScreenWrapperUi";
import ProfileView from "./ProfileView";

const ProfileScreen = observer(() => {
  return (
    <ScreenWrapper>
      {authStore.accessToken ? <ProfileView /> : <LoginPromptView />}
    </ScreenWrapper>
  );
});

export default ProfileScreen;
