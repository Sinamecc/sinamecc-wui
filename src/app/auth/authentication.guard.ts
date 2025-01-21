import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Logger } from '@core/logger.service';
import { CredentialsService } from './credentials.service';

const log = new Logger('AuthenticationGuard');

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard {
  constructor(
    private readonly router: Router,
    private readonly credentialsService: CredentialsService
  ) {}

  /**
   * Determines if a route can be activated based on authentication status.
   * @param route - The route that is being accessed.
   * @param state - The current router state.
   * @returns True if the user is authenticated, otherwise redirects to login and returns false.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.credentialsService.isAuthenticated()) {
      log.debug('User is authenticated. Access granted.');
      return true;
    }

    log.debug('User is not authenticated. Redirecting to login...');
    this.redirectToLogin(state.url);
    return false;
  }

  /**
   * Redirects the user to the login page with the intended URL as a query parameter.
   * @param redirectUrl - The URL the user attempted to access.
   */
  private redirectToLogin(redirectUrl: string): void {
    this.router.navigate(['/login'], {
      queryParams: { redirect: redirectUrl },
      replaceUrl: true,
    });
  }
}
