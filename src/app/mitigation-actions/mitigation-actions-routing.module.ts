import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';

import { MitigationActionsListComponent } from './mitigation-actions-list/mitigation-actions-list.component';


const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: 'mitigation/actionst', pathMatch: 'full' },
    { path: 'mitigation/actions', component: MitigationActionsListComponent, data: { title: extract('MitigationActions') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class MitigationActionsRoutingModule { }
