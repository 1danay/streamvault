import { authStore } from "@/stores/auth";
import { observer } from "mobx-react-lite";
import { LoginPromptView } from "./LoginPromptView";

const ProfileScreen = observer(() => {
  return authStore.accessToken ? <ProfileView /> : <LoginPromptView />;
});

export default ProfileScreen;
