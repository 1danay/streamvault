import { AuthResponse, LoginRequest, RegisterRequest } from "./authApi.types";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const authApi = {
  login: async (request: LoginRequest) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: request.email,
        password: request.password,
      } as LoginRequest),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      console.error(err);
      throw new Error(err?.message ?? "Неверный email или пароль");
    }

    console.debug(res.json());

    return res.json() as Promise<AuthResponse>;
  },

  register: async (request: RegisterRequest) => {
    console.log(`${BASE_URL}/auth/register`);
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: request.email,
        username: request.username,
        password: request.password,
      } as RegisterRequest),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message ?? "Ошибка регистрации");
    }

    return res.json() as Promise<AuthResponse>;
  },
};
