import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable, Output, inject } from '@angular/core';
import { Router } from '@angular/router';


export interface UserInfo {
  login: string;
  photo: string;
  authData: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Output() errors: EventEmitter<any> = new EventEmitter();
  @Output() authChanged: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, @Inject('BASE_API_URL') private baseUrl: string, private router: Router) { }

  login(login: string, password: string, rememberMe: boolean) {
    const formData = new FormData();
    formData.append('login', login);
    formData.append('password', password);

    const storage = rememberMe ? localStorage : sessionStorage;

    this.http.post(this.baseUrl + '/Login', formData).subscribe(
      {
        next: (user: any) => {
          const authData = window.btoa(login + ':' + password);
          const userInfo: UserInfo = { login: login, photo: user.photo, authData: authData };
          storage.setItem('userInfo', JSON.stringify(userInfo));
          storage.setItem('isAuthenticated', 'true');
          this.authChanged.emit();
          this.router.navigate(['']);

        },
        error: (e) => {
          this.errors.emit(e);
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isAuthenticated');

    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('isAuthenticated');

    this.authChanged.emit();
    this.router.navigate(['']);
  }

  isAuthenticated(): boolean {
    const isLocal = localStorage.getItem('isAuthenticated') == 'true';
    const isSession = sessionStorage.getItem('isAuthenticated') == 'true';
    return isLocal || isSession;
  }

  getUserInfo(): UserInfo {

    let user = JSON.parse(localStorage.getItem('userInfo')!) as UserInfo;
    if (user == null) {

     user = JSON.parse(sessionStorage.getItem('userInfo')!) as UserInfo;
    }
    return user;
  }
}