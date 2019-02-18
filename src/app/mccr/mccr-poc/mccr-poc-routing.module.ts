import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';

import { MccrPocListComponent } from './mccr-poc-list/mccr-poc-list.component';
import { MccrSearchPocComponent } from './mccr-search-poc/mccr-search-poc.component';

const routes: Routes = [
    Route.withShell([
        { path: '', redirectTo: 'mccr/poc', pathMatch: 'full' },
        { path: 'mccr/poc/:id', component: MccrPocListComponent, data: { id: extract('id') } },
        { path: 'mccr/poc', component: MccrSearchPocComponent, data: { title: extract('Mccr-POC') } }
    ])
  ];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class MccrPocRoutingModule { }
   