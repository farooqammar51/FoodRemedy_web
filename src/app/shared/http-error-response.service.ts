import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";

@Injectable({providedIn: 'root'})
export class HttpErrorResponseService {

    handleError(error: HttpErrorResponse) {
        if (error.status === 401) {
            return throwError(() => new Error('Unauthorized.'));
        } 
        if (error.status === 404) {
            return throwError(() => new Error('Not Found.'));
        } 
        if(error.status === 409) {
            return throwError(() => new Error('Already exists.'))
        }
        else {
            return throwError(() => new Error('Something went wrong.'));
        }
    }
}