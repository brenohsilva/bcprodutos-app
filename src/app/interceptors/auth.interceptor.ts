import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<string | null> =
        new BehaviorSubject<string | null>(null);

    constructor(private router: Router, private http: HttpClient) {}

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
                if (
                    error instanceof HttpErrorResponse &&
                    error.status === 401
                ) {
                    return this.handle401Error(authReq, next);
                } else if (
                    error instanceof HttpErrorResponse &&
                    error.status === 403
                ) {
                    this.router.navigate(['/auth/login']);
                }
                return throwError(() => error);
            })
        );
    }

    private handle401Error(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const refresh_token = localStorage.getItem('refresh_oken');

            if (!refresh_token) {
                this.router.navigate(['/auth/login']);
                return throwError(
                    () => new Error('Refresh token não encontrado')
                );
            }

            return this.http
                .post<{ access_token: string }>(
                    'http://localhost:3000/auth/refresh',
                    { refresh_token }
                )
                .pipe(
                    switchMap((response) => {
                        localStorage.setItem('token', response.access_token);
                        this.isRefreshing = false;
                        this.refreshTokenSubject.next(response.access_token);

                        return next.handle(
                            req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${response.access_token}`,
                                },
                            })
                        );
                    }),
                    catchError(() => {
                        this.isRefreshing = false;
                        this.router.navigate(['/auth/login']);
                        return throwError(
                            () => new Error('Erro ao renovar token')
                        );
                    })
                );
        } else {
            return this.refreshTokenSubject.pipe(
                filter((token) => token !== null),
                take(1),
                switchMap((token) => {
                    return next.handle(
                        req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                    );
                })
            );
        }
    }
}
