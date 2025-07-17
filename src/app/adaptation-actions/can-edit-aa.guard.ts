import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { PermissionService } from '@app/@core/permissions.service';
import { Observable } from 'rxjs';
import { States } from '@app/@shared/next-state';
import { AdaptationActionService } from './adaptation-actions-service';

@Injectable({
  providedIn: 'root',
})
export class CanEditAAGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private adaptationActionService: AdaptationActionService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const id = route.params['id'];
    const queryState = route.queryParams['state'] as States | undefined;

    return new Promise((resolve) => {
      this.adaptationActionService.loadOneAdaptationActions(id).subscribe({
        next: (aa) => {
          const currentState = aa.fsm_state.state as States;

          const canEdit =
            this.permissionService.canEditAA(currentState) || this.permissionService.canEditAcceptedAA(currentState);
          if (!canEdit) {
            resolve(this.router.createUrlTree(['/unauthorized']));
            return;
          }

          if (queryState) {
            resolve(true);
          } else {
            resolve(
              this.router.createUrlTree(['/adaptation/actions', id, 'update'], {
                queryParams: {
                  ...route.queryParams,
                  state: currentState,
                },
              }),
            );
          }
        },
        error: () => resolve(this.router.createUrlTree(['/unauthorized'])),
      });
    });
  }
}
