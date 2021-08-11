import { Injectable } from '@angular/core';
import { Route as ngRoute, Routes } from '@angular/router';

import { ShellComponent } from '@app/shell/shell.component';
import { AuthenticationGuard } from '@app/auth';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  constructor() {}

  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return {Route} The new route using shell as the base.
   */
  static withShell(routes: Routes): ngRoute {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      canActivate: [AuthenticationGuard],
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: true },
    };
  }
}
