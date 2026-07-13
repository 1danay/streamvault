import { UserEntity } from "@/entities/user/user.entity";

export interface AuthResponse extends UserEntity {
  accessToken: string;
  refreshToken: string;
}

// LOGIN
export interface LoginRequest {
  email: string;
  password: string;
}

// REGISTER
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}
