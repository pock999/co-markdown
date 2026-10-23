import { apiRequest } from './api-client';

export interface GoogleLoginResponse {
  jwtToken: string;
  name: string;
  email: string;
}

export async function googleLogin(
  credential: string,
): Promise<GoogleLoginResponse> {
  return apiRequest<GoogleLoginResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });
}
