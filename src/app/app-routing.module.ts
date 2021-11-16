import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { ErrorComponent } from '@app/error/error.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {
      path: 'about',
      loadChildren: () => import('src/app/about/about.module').then((m) => m.AboutModule),
    },
    {
      path: 'report',
      loadChildren: () => import('src/app/report/report.module').then((m) => m.ReportModule),
    },
    {
      path: 'mitigation/actions',
      loadChildren: () =>
        import('src/app/mitigation-actions/mitigation-actions.module').then((m) => m.MitigationActionsModule),
    },
    {
      path: 'mccr/registries',
      loadChildren: () =>
        import('src/app/mccr/mccr-registries/mccr-registries.module').then((m) => m.MccrRegistriesModule),
    },
    {
      path: 'mccr/poc',
      loadChildren: () => import('src/app/mccr/mccr-poc/mccr-poc.module').then((m) => m.MccrPocModule),
    },
    {
      path: 'ppcn',
      loadChildren: () => import('src/app/ppcn/ppcn.module').then((m) => m.PpcnModule),
    },
    {
      path: 'admin',
      loadChildren: () => import('src/app/admin/admin.module').then((m) => m.AdminModule),
    },
    { path: 'error', component: ErrorComponent },
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
