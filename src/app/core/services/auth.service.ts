import { inject, Injectable, signal, computed } from "@angular/core";
import { delay, map, of, Observable } from "rxjs";

import { AuthResponse, LoginRequest, User } from "../models";
import { LocalStorageService } from './local-storage.service';
import { MockDataService } from './mock-data.service';
import { STORAGE_KEYS } from '../constants';

@Injectable({providedIn:'root'})
export class AuthService {
    private readonly TOKEN_KEY = STORAGE_KEYS.AUTH_TOKEN;
    private readonly USER_KEY = STORAGE_KEYS.CURRENT_USER;

    private currentUserSignal = signal<User | null>(null);
    private tokenSignal = signal<string | null>(null);

    public readonly currentUser = this.currentUserSignal.asReadonly();
    public readonly isAuthenticated = computed(() => !!this.currentUser() && !!this.tokenSignal());
    public readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
    public readonly isUser = computed(() => this.currentUser()?.role === 'user');

    public readonly currentUser$ = this.currentUser;
    public readonly isAuthenticated$ = this.isAuthenticated;

    private readonly localStorageService = inject(LocalStorageService);
    private readonly mockDataService = inject(MockDataService);

    constructor() {
        this.initializeAuthState();
    }

    private initializeAuthState(): void {
        const savedUser = this.localStorageService.getItem<User>(this.USER_KEY);
        const savedToken = this.localStorageService.getItem<string>(this.TOKEN_KEY);
    
        if (savedUser && savedToken) {
          this.currentUserSignal.set(savedUser);
          this.tokenSignal.set(savedToken);
        }
    }

    login(credentials: LoginRequest): Observable<AuthResponse>{
        return of(null).pipe(
            delay(1000),
            map(() => {
                const user = this.mockDataService.findUserByCredentials(
                    credentials.username,
                    credentials.password
                );

                if(!user){
                    throw new Error('Username or password is incorrect')
                }

                const token = this.generateMockToken(user);
                
                this.localStorageService.setItem(this.USER_KEY, user);
                this.localStorageService.setItem(this.TOKEN_KEY, token);

                this.currentUserSignal.set(user);
                this.tokenSignal.set(token);

                return { user, token };
            })
        );
    }

    logout(): void {
        this.localStorageService.removeItem(this.USER_KEY);
        this.localStorageService.removeItem(this.TOKEN_KEY);
    
        this.currentUserSignal.set(null);
        this.tokenSignal.set(null);
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
}