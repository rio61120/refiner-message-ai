export interface AuthUserResponse {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResponseDto {
  accessToken: string;
  expiresAt: string;
  user: AuthUserResponse;
}
