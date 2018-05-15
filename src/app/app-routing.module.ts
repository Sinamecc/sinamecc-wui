import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Route } from '@app/core';

const routes: Routes = [
  Route.withShell([
    { path: 'about', loadChildren: 'app/about/about.module#AboutModule' },
    { path: 'report', loadChildren: 'app/report/report.module#ReportModule' },
    { path: 'mitigation/actions', loadChildren: 'app/mitigation-actions/mitigation-actions.module#MitigationActionsModule' },
    { path: 'mccr/registries', loadChildren: 'app/mccr-registries/mccr-registries.module#MccrRegistriesModule' }
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
