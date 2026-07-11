import { fetcher } from './fetcher'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  fullName: string
}

interface LoginResponse {
  accessToken: string
}

interface RegisterResponse {
  message: string
}

export const authApi = {
  login(data: LoginPayload) {
    return fetcher<LoginResponse>('/auth/login', {
      method: 'POST',
      body: data,
    })
  },

  register(data: RegisterPayload) {
    return fetcher<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: data,
    })
  },
}
