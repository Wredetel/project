import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userServece: UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isLoggedId = this.userServece.isAuthenticated();
    const userInfo = this.userServece.getUserInfo();

if (isLoggedId){
  request = request.clone({
    setHeaders:{ Authorization: `Basic ${userInfo.authData}`}
  });
}
    return next.handle(request);
  }
}
