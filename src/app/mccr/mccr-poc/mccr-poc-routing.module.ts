import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';

import { MccrPocListComponent } from './mccr-poc-list/mccr-poc-list.component';
import { MccrSearchPocComponent } from './mccr-search-poc/mccr-search-poc.component';
import { MccrPocAddBuyerComponent } from './mccr-poc-add-buyer/mccr-poc-add-buyer.component';
import { MccrPocAddDeveloperComponent } from './mccr-poc-add-developer/mccr-poc-add-developer.component';
import { MccrPocAddPocComponent } from './mccr-poc-add-poc/mccr-poc-add-poc.component';

const routes: Routes = [
    Route.withShell([
        { path: '', redirectTo: 'mccr/poc', pathMatch: 'full' },
        { path: 'mccr/poc/detail/:id', component: MccrPocListComponent, data: { id: extract('id') } },
        { path: 'mccr/poc', component: MccrSearchPocComponent, data: { title: extract('Mccr-POC') } },
        { path: 'mccr/poc/:id/add-Buyer-Transfer', component: MccrPocAddBuyerComponent, data: { id: extract('id') } },
        { path: 'mccr/poc/:id/add-Developer-Transfer', component: MccrPocAddDeveloperComponent, data: { id: extract('id') } },
        { path: 'mccr/poc/new', component: MccrPocAddPocComponent,  data: { title: extract('New') } },
    ])
  ];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class MccrPocRoutingModule { }

