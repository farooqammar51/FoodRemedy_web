import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  errorCounter = 0;

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    if (token != null) {
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }
    //return next.handle(req).pipe(catchError((err) => this.handleError(err)));
    return next.handle(req);
  }

  handleError(err: HttpErrorResponse): Observable<any> {
    if (err && err.status === 401 && this.errorCounter == 0) {
      this.errorCounter++;
      this.authService
        .refreshToken(this.authService.getRefreshToken())
        .subscribe({
          next: (x: any) => {
            console.log('Token refreshed, try again');
            return of('Token refreshed, try again');
          },
          error: (err: any) => {
            this.authService.logout();
          },
        });
      return of('Attempting to refresh tokens');
    } else {
      this.errorCounter = 0;
      return throwError(() => new Error('Non authentication error'));
    }
  }
}
