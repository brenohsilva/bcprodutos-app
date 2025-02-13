import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) {}

    private readonly url = environment.BASE_URL;

    login(username: string, password: string): Observable<any> {
        return this.http.post<{ token: string }>(`${this.url}auth/login`, {
            username,
            password,
        });
    }
}
