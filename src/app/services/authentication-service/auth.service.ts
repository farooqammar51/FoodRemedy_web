import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  pipe,
  tap,
} from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { HttpErrorResponseService } from 'src/app/shared/http-error-response.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  tokenExpirationTimer: any;

  isUserIdle!: boolean;
  idleStateSubscription = new Subscription();

  isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.getInitialAuthState()
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private httpErrorResponseService: HttpErrorResponseService
  ) {}

  private getInitialAuthState(): boolean {
    const storedToken = this.getAccessToken();

    if (storedToken) {
      return this.IsAcessTokenValid();
    }
    return false;
  }

  getIdleStateSubject(isUserIdleSubject: BehaviorSubject<boolean>) {
    this.idleStateSubscription = isUserIdleSubject.subscribe((idleState) => {
      this.isUserIdle = idleState;
    });
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken') || null;
  }

  private setAccessToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  getRefreshToken(): string {
    return localStorage.getItem('refreshToken')!;
  }

  private setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  getTokenType(): string | null {
    return localStorage.getItem('tokenType') || null;
  }

  private setTokenType(tokenType: string): void {
    localStorage.setItem('tokenType', tokenType);
  }

  set username(username: string) {
    localStorage.setItem('username', username);
  }

  get username(): string | null {
    return localStorage.getItem('username') || null;
  }

  private setTokenExpiration(tokenExpirationTimeInSeconds: number) {
    const currentTimestampInMiliseconds = Math.floor(new Date().getTime());
    const tokenExpirationTimestampInMiliseconds =
      currentTimestampInMiliseconds + tokenExpirationTimeInSeconds * 1000;

    localStorage.setItem(
      'tokenExpirationTimestamp',
      tokenExpirationTimestampInMiliseconds.toString()
    );
  }

  login(email: string, password: string): Observable<any> {
    const loginData = {
      Email: email,
      Password: password,
    };

    return this.http
      .post<any>(environment.domain + 'auth/login', loginData)
      .pipe(
        catchError(this.httpErrorResponseService.handleError),
        tap((response) => {
          if (response && response.accessToken) {
            this.setAccessToken(response.accessToken);
            this.setRefreshToken(response.refreshToken);
            this.setTokenExpiration(response.expiresIn);
            this.setTokenType(response.tokenType);

            this.isAuthenticatedSubject.next(true);

            this.autoLogout(response.expiresIn * 1000);
          }
        })
      );
  }

  refreshToken(refreshToken: string) {
    const payload = {
      RefreshToken: refreshToken,
    };
    return this.http
      .post<any>(environment.domain + 'auth/refresh', payload)
      .pipe(
        tap((response) => {
          console.log(response);
          if (response && response.accessToken) {
            this.setAccessToken(response.accessToken);
            this.setRefreshToken(response.refreshToken);
            this.setTokenExpiration(response.expiresIn);
            this.setTokenType(response.tokenType);

            this.isAuthenticatedSubject.next(true);

            this.autoLogout(response.expiresIn * 1000);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('tokenExpirationTimestamp');
    localStorage.removeItem('username');
    this.router.navigate(['login']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  reCalculateTokenExpirationTimeAfterReload() {
    const tokenExpirationTimeStamp = localStorage.getItem(
      'tokenExpirationTimestamp'
    );
    if (tokenExpirationTimeStamp !== null) {
      const currentTimestampInMilliseconds = new Date().getTime();
      const remainingTimeInMilliseconds =
        +tokenExpirationTimeStamp - currentTimestampInMilliseconds;
      this.autoLogout(remainingTimeInMilliseconds);
    }
  }

  autoLogout(tokenExpirationDuration: number) {
    console.log(tokenExpirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      if (this.isUserIdle) {
        this.logout();
      } else {
        this.refreshToken(this.getRefreshToken()).subscribe();
      }
    }, tokenExpirationDuration);
  }

  IsAcessTokenValid(): boolean {
    const tokenExpirationTimeStamp = localStorage.getItem(
      'tokenExpirationTimestamp'
    );
    if (tokenExpirationTimeStamp !== null) {
      const currentTimestampInMilliseconds = new Date().getTime();
      if (+tokenExpirationTimeStamp > currentTimestampInMilliseconds) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    this.idleStateSubscription.unsubscribe();
  }
}
