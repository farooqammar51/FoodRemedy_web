import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, catchError, tap } from "rxjs";
import { HttpErrorResponseService } from "src/app/shared/http-error-response.service";

@Injectable({ providedIn: 'root' })
export class UserService {

  isUserSelectedSubject = new BehaviorSubject<boolean>(false);
  refreshUsersSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private httpErrorResponseService: HttpErrorResponseService) {}

      registerUser(email: string, password: string): Observable<any> {
        const registerUser = {
          Email: email,
          Password: password
      };

      return this.http.post<any>(environment.domain + "users/register", registerUser).pipe(
          tap(response => {
              if (response) {
                this.refreshUsersSubject.next(true);
                return response
              }
          }),
          catchError(this.httpErrorResponseService.handleError)
      );
      }

      getUsers(skip: number, take: number) {
        const paginationRequest = {
          Skip: skip,
          Take: take
        }
        return this.http.get<any>(environment.domain + "users", { params: paginationRequest }).pipe(
          tap(response => {
            if(response) {
              return response;
            }
          }), 
          catchError(this.httpErrorResponseService.handleError)
        )
      }

      getUser(userId: string) {
        return this.http.get<any>(`${environment.domain}users/${userId}`).pipe(
          tap(resposne => {
            if(resposne) {
              return resposne;
            }
          }),
          catchError(this.httpErrorResponseService.handleError)
        );
      }

}