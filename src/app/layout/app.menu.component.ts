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
                        routerLink: ['/info/estoque'],
                    },
                    {
                        label: 'Vendas',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/info/vendas'],
                    },
                    {
                        label: 'Compras',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/info/compras'],
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
                                        routerLink: ['/review', '2024', '12', 'general'],
                                    }
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
                                        routerLink: ['/review', '2025', '01', 'general'], 
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
                                        routerLink: ['/review', '2025', '02', 'general'], 
                                    },
                                ],
                            },
                            {
                                label: 'Março',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    {
                                        label: 'Geral',
                                        icon: 'pi pi-fw pi-bookmark',
                                        routerLink: ['/review', '2025', '03', 'general'], 
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
