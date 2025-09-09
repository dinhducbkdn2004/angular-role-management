export interface LoginFormData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginFormErrors {
  username?: string;
  password?: string;
  general?: string;
}

export interface LoginFormState {
  data: LoginFormData;
  errors: LoginFormErrors;
  isLoading: boolean;
  isSubmitted: boolean;
}
