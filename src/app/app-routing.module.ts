import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Route } from '@app/core';
import { ReportComponent } from '@app/report/report.component'
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: '/home',  pathMatch: 'full' },
    { path: 'home', component: ReportComponent },
    { path: 'about', loadChildren: 'app/about/about.module#AboutModule' },
    { path: 'report', loadChildren: 'app/report/report.module#ReportModule' },
    { path: 'mitigation/actions', loadChildren: 'app/mitigation-actions/mitigation-actions.module#MitigationActionsModule' },
    { path: 'mccr/registries', loadChildren: 'app/mccr-registries/mccr-registries.module#MccrRegistriesModule' },
    { path: 'ppcn', loadChildren: 'app/ppcn/ppcn.module#PpcnModule' },
    { path: 'error', component: ErrorComponent },
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
