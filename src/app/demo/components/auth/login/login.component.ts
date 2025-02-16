import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    providers: [MessageService],
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent {
    valCheck: string[] = ['remember'];

    username!: string;
    password!: string;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    login() {
        
        this.authService
            .login(this.username, this.password)
            .subscribe((response) => {
                localStorage.setItem('token', response.access_token);
                this.router.navigate(['/']);
            }, (error: any) => {
                console.error('Erro ao fazer login:', error);
                this.show()
            }
        );
    }

    show() {
        this.messageService.add({
            severity: 'error',
            summary: 'Algo deu erro',
            detail: 'Login ou senha invalidos',
            life: 3000,
        });
    }
}
