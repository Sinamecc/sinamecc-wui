import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { PermissionService } from '@app/@core/permissions.service';
import { MitigationActionsService } from './mitigation-actions.service';
import { I18nService } from '@app/i18n';
import { States } from '@app/@shared/next-state';

@Injectable({
  providedIn: 'root',
})
export class CanEditMAGuard implements CanActivate {
  constructor(
    private i18nService: I18nService,
    private permissionService: PermissionService,
    private mitigationActionService: MitigationActionsService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const id = route.params['id'];
    const queryState = route.queryParams['state'] as States | undefined;

    return new Promise((resolve) => {
      this.mitigationActionService.getMitigationAction(id, this.i18nService.language.split('-')[0]).subscribe({
        next: (ma) => {
          const currentState = ma.fsm_state.state as States;

          const canEdit =
            this.permissionService.canEditMA(currentState) || this.permissionService.canEditAcceptedMA(currentState);

          if (!canEdit) {
            resolve(this.router.createUrlTree(['/unauthorized']));
            return;
          }

          if (queryState) {
            resolve(true);
          } else {
            resolve(
              this.router.createUrlTree(['/mitigation/actions', id, 'edit'], {
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
