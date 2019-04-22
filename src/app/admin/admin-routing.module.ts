import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';

import { AdminNewComponent } from './admin-new/admin-new.component';


const routes: Routes = [
 Route.withShell([
   { path: '', redirectTo: 'admin', pathMatch: 'full' },
   { path: 'admin/new', component: AdminNewComponent, data: { title: extract('Admin New') } }
 ])
];

@NgModule({
 imports: [RouterModule.forChild(routes)],
 exports: [RouterModule],
 providers: []
})
export class AdminRoutingModule { }
