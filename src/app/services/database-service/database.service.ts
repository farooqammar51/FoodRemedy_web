import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, tap, throwError } from "rxjs";
import { DatabaseModel } from "src/app/models/database.model";
import { tag, tagsModel } from "src/app/models/tags.model";
import { HttpErrorResponseService } from "src/app/shared/http-error-response.service";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class DatabaseService {

  constructor(private http: HttpClient, private httpErrorResponseService: HttpErrorResponseService) { }

  refreshDatabaseSubject = new BehaviorSubject<boolean>(false);

  getIngredients(skip: number, take: number): Observable<DatabaseModel> {
    const paginationRequest = {
      Skip: skip,
      Take: take
    }
    return this.http.get<DatabaseModel>(environment.domain + "ingredients", { params: paginationRequest }).pipe(
      tap(response => {
        if (response) {
          return response;
        }
        return throwError(() => { new Error("An unexpected error occured!") });
      }),
      catchError(this.httpErrorResponseService.handleError)
    )
  }

  getIngredient(ingredientId: string): Observable<tagsModel> {
    return this.http.get<tagsModel>(`${environment.domain}ingredients/${ingredientId}`).pipe(
      tap(response => {
        if (response) {
          return response;
        }
        return throwError(() => { new Error("An unexpected error occured!") });
      }),
      catchError(this.httpErrorResponseService.handleError)
    )
  }

  getCategories(skip: number, take: number): Observable<tagsModel> {
    const paginationRequest = {
      Skip: skip,
      Take: take
    }
    return this.http.get<tagsModel>(environment.domain + "tags/categories", { params: paginationRequest }).pipe(
      tap(response => {
        if (response) {
          return response;
        }
        return throwError(() => { new Error("An unexpected error occured!") });
      }),
      catchError(this.httpErrorResponseService.handleError)
    )
  }

  getTags(category: string, skip: number, take: number): Observable<tag> {
    const paginationRequest = {
      Skip: skip,
      Take: take
    }
    return this.http.get<tag>(environment.domain + "tags", { params: paginationRequest }).pipe(
      tap(response => {
        if (response) {
          return response;
        }
        return throwError(() => { new Error("An unexpected error occured!") });
      }),
      catchError(this.httpErrorResponseService.handleError)
    )
  }
}