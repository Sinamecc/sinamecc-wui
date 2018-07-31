import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';
import { PpcnLevelComponent } from '@app/ppcn/ppcn-level/ppcn-level.component';

const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: 'mccr/registries', pathMatch: 'full' },
    { path: 'ppcn/level', component: PpcnLevelComponent, data: { title: extract('PpcnLevel') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PpcnRoutingModule { }
