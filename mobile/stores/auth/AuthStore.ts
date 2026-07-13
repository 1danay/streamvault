import { makeAutoObservable, runInAction } from "mobx";
import * as SecureStore from "expo-secure-store";
import { authApi } from "@/api/auth/authApi";

class AuthStore {
  accessToken: string | null = null;
  refreshToken: string | null = null;
  isLoading = true;
  isSubmitting = false;

  constructor() {
    makeAutoObservable(this);
  }

  async login(email: string, password: string) {
    this.isSubmitting = true;

    const request = {
      email,
      password,
    };

    try {
      const data = await authApi.login(request);
      await this.setTokens(data.accessToken, data.refreshToken);
    } catch (err) {
      throw err;
    } finally {
      runInAction(() => {
        this.isSubmitting = false;
      });
    }
  }

  async register(username: string, email: string, password: string) {
    this.isSubmitting = true;

    const request = {
      username,
      email,
      password,
    };

    try {
      const data = await authApi.register(request);
      await this.setTokens(data.accessToken, data.refreshToken);
    } catch (err) {
      throw err;
    } finally {
      runInAction(() => {
        this.isSubmitting = false;
      });
    }
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
