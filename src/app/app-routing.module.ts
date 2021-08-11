import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { ErrorComponent } from '@app/error/error.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'about', loadChildren: () => import('./about/about.module').then((m) => m.AboutModule) },
    { path: 'report', loadChildren: () => import('./report/report.module').then((m) => m.ReportModule) },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule) },
    { path: 'ppcn', loadChildren: () => import('./ppcn/ppcn.module').then((m) => m.PpcnModule) },
    { path: 'error', component: ErrorComponent },
    {
      path: 'mitigation/actions',
      loadChildren: () =>
        import('./mitigation-actions/mitigation-actions.module').then((m) => m.MitigationActionsModule),
    },
    {
      path: 'mccr/registries',
      loadChildren: () => import('./mccr/mccr-registries/mccr-registries.module').then((m) => m.MccrRegistriesModule),
    },
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
