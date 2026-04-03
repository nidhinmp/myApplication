import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  storeId: number | null;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
  storeId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'pos_token';
  private userKey = 'pos_user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(tap(response => {
        this.storeToken(response.token);
        this.storeUser({
          id: response.id,
          username: response.username,
          email: response.email,
          role: response.role,
          storeId: response.storeId
        });
        this.currentUserSubject.next(this.getStoredUser());
      }));
  }

  register(data: { username: string; email: string; password: string; fullName: string; role: string }): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/register`, data)
      .pipe(tap(response => {
        this.storeToken(response.token);
        this.storeUser({
          id: response.id,
          username: response.username,
          email: response.email,
          role: response.role,
          storeId: response.storeId
        });
      }));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private storeUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }
}