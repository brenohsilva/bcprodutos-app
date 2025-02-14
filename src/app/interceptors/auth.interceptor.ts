import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token'); 

        let authReq = req;

        if (token) {
            authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        return next.handle(authReq).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 401 || error.status === 403) {
                       
                        this.router.navigate(['/auth/login']);
                    }
                }
                return throwError(() => error);
            })
        );
    }
}
