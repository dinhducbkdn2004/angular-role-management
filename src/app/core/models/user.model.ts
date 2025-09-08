export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  fullName: string;
  createAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
