import { NgModule } from '@angular/core';



import { HomeComponent } from './home.component';

import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';

const routes: Routes = [
    Route.withShell([
    { path: '', component: HomeComponent, data: { title: extract('Home') } },
  ])
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class HomeRoutingModule { }