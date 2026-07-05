import { makeAutoObservable, runInAction } from "mobx";
import * as SecureStore from "expo-secure-store";

class AuthStore {
  accessToken: string | null = null;
  refreshToken: string | null = null;
  isLoading = true;

  constructor() {
    makeAutoObservable(this);
  }

  async loadTokens() {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync("access_token"),
      SecureStore.getItemAsync("refresh_token"),
    ]);

    console.log("[auth] loaded:", {
      hasAccess: !!accessToken,
      hasRefresh: !!refreshToken,
    });

    runInAction(() => {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;

      this.isLoading = false;
    });
  }

  async setTokens(accessToken: string, refreshToken: string) {
    await Promise.all([
      SecureStore.setItemAsync("access_token", accessToken),
      SecureStore.setItemAsync("refresh_token", refreshToken),
    ]);

    runInAction(() => {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    });
  }

  async clearTokens() {
    await Promise.all([
      SecureStore.deleteItemAsync("access_token"),
      SecureStore.deleteItemAsync("refresh_token"),
    ]);

    runInAction(() => {
      this.accessToken = null;
      this.refreshToken = null;
    });
  }
}

export const authStore = new AuthStore();
