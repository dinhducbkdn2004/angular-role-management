import { inject, Injectable, signal, computed } from "@angular/core";

import { LoginRequest, User } from "../models";
import { LocalStorageService } from './local-storage.service';
import { MockDataService } from './mock-data.service';
import { STORAGE_KEYS } from '../constants';

@Injectable({providedIn:'root'})
export class AuthService {
    private readonly TOKEN_KEY = STORAGE_KEYS.AUTH_TOKEN;
    private readonly USER_KEY = STORAGE_KEYS.CURRENT_USER;

    // Signals for reactive state management
    private currentUserSignal = signal<User | null>(null);
    private tokenSignal = signal<string | null>(null);
    private isLoadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    // Public readonly signals
    public readonly currentUser = this.currentUserSignal.asReadonly();
    public readonly isAuthenticated = computed(() => !!this.currentUser() && !!this.tokenSignal());
    public readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
    public readonly isUser = computed(() => this.currentUser()?.role === 'user');
    public readonly isLoading = this.isLoadingSignal.asReadonly();
    public readonly error = this.errorSignal.asReadonly();

    private readonly localStorageService = inject(LocalStorageService);
    private readonly mockDataService = inject(MockDataService);

    constructor() {
        this.initializeAuthState();
    }

    private initializeAuthState(): void {
        const savedUser = this.localStorageService.getItem<User>(this.USER_KEY);
        const savedToken = this.localStorageService.getItem<string>(this.TOKEN_KEY);
    
        if (savedUser && savedToken) {
          if (this.isTokenValid(savedToken)) {
            this.currentUserSignal.set(savedUser);
            this.tokenSignal.set(savedToken);
          } else {
            this.logout();
          }
        }
    }

    async login(credentials: LoginRequest): Promise<User> {
        this.isLoadingSignal.set(true);
        this.errorSignal.set(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const user = this.mockDataService.findUserByCredentials(
                credentials.username,
                credentials.password
            );

            if (!user) {
                throw new Error('Username or password is incorrect');
            }

            const token = this.generateMockToken(user);
            
            this.localStorageService.setItem(this.USER_KEY, user);
            this.localStorageService.setItem(this.TOKEN_KEY, token);

            this.currentUserSignal.set(user);
            this.tokenSignal.set(token);

            return user;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            this.errorSignal.set(errorMessage);
            throw error;
        } finally {
            this.isLoadingSignal.set(false);
        }
    }

    logout(): void {
        this.localStorageService.removeItem(this.USER_KEY);
        this.localStorageService.removeItem(this.TOKEN_KEY);
        this.localStorageService.removeItem(STORAGE_KEYS.EMPLOYEES_DATA);
    
        this.currentUserSignal.set(null);
        this.tokenSignal.set(null);
        this.errorSignal.set(null);
        this.isLoadingSignal.set(false);
    }

    getCurrentUser(): User | null {
        return this.currentUser();
    }
    
    isAuthenticatedMethod(): boolean {
        return this.isAuthenticated();
    }
    
    hasRole(role: 'admin' | 'user'): boolean {
        return this.currentUser()?.role === role;
    }
    
    getToken(): string | null {
        return this.tokenSignal();
    }
    
      private generateMockToken(user: User): string {
        const payload = {
          userId: user.id,
          username: user.username,
          role: user.role,
          exp: Date.now() + (24 * 60 * 60 * 1000)
        };
        
        return btoa(JSON.stringify(payload));
      }

      private isTokenValid(token: string): boolean {
        try {
          const payload = JSON.parse(atob(token));
          return payload.exp > Date.now();
        } catch {
          return false;
        }
      }
}