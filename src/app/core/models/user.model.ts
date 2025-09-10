export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  fullName: string;
  createdAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}
