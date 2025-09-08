import { LocalStorageService } from './local-storage.service';
import { inject, Injectable } from "@angular/core";
import { AuthResponse, LoginRequest, User } from "../models";
import { BehaviorSubject, delay, map, of, Observable } from "rxjs";
import { MockDataService } from './mock-data.service';

@Injectable({providedIn:'root'})
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'current_user';

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    private localStorageService = inject(LocalStorageService);
    private mockDataService = inject(MockDataService);

    constructor() {
        this.initializeAuthState();
    }

    private initializeAuthState(): void {
        const savedUser = this.localStorageService.getItem<User>(this.USER_KEY);
        const savedToken = this.localStorageService.getItem<string>(this.TOKEN_KEY);
    
        if (savedUser && savedToken) {
          this.currentUserSubject.next(savedUser);
          this.isAuthenticatedSubject.next(true);
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

                this.currentUserSubject.next(user);
                this.isAuthenticatedSubject.next(true);

                return { user, token };
            })
        );
    }

    logout(): void {
        this.localStorageService.removeItem(this.USER_KEY);
        this.localStorageService.removeItem(this.TOKEN_KEY);
    
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
      }
    
      isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
      }
    
      hasRole(role: 'admin' | 'user'): boolean {
        const currentUser = this.getCurrentUser();
        return currentUser?.role === role;
      }
    
      isAdmin(): boolean {
        return this.hasRole('admin');
      }
    
      isUser(): boolean {
        return this.hasRole('user');
      }
    
      getToken(): string | null {
        return this.localStorageService.getItem<string>(this.TOKEN_KEY);
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