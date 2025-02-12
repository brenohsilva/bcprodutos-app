import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    constructor(public layoutService: LayoutService) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    {
                        label: 'Visão Geral',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/'],
                    },
                ],
            },
            {
                label: 'Informações',
                items: [
                    {
                        label: 'Estoque',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/uikit/estoque'],
                    },
                    {
                        label: 'Vendas',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/uikit/vendas'],
                    },
                    {
                        label: 'Compras',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/uikit/compras'],
                    },
                ],
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing'],
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login'],
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error'],
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access'],
                            },
                        ],
                    },
                ],
            },
            {
                label: 'Resumo',
                items: [
                    {
                        label: '2024',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Dezembro',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    {
                                        label: 'Geral',
                                        icon: 'pi pi-fw pi-bookmark',
                                    },
                                    {
                                        label: 'Vendas',
                                        icon: 'pi pi-fw pi-bookmark',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        label: '2025',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Janeiro',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    {
                                        label: 'Geral',
                                        icon: 'pi pi-fw pi-bookmark',
                                    },
                                    {
                                        label: 'Vendas',
                                        icon: 'pi pi-fw pi-bookmark',
                                    },
                                    {
                                        label: 'Compras',
                                        icon: 'pi pi-fw pi-bookmark',
                                    },
                                ],
                            },
                            {
                                label: 'Fevereiro',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    {
                                        label: 'Geral',
                                        icon: 'pi pi-fw pi-bookmark',
                                    },
                                    {
                                        label: 'Vendas',
                                        icon: 'pi pi-fw pi-bookmark',
                                    },
                                    {
                                        label: 'Compras',
                                        icon: 'pi pi-fw pi-bookmark',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ];
    }
}
