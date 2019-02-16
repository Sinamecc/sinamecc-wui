import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';

import { MccrPocListComponent } from './mccr-poc-list/mccr-poc-list.component';

const routes: Routes = [
    Route.withShell([
        { path: '', redirectTo: 'mccr/poc', pathMatch: 'full' },
        { path: 'mccr/poc', component: MccrPocListComponent, data: { title: extract('Mccr-POc-List') } }

    ])
  ];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class MccrPocRoutingModule { }
   