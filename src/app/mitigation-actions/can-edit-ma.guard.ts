import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { PermissionService } from '@app/@core/permissions.service';
import { Observable } from 'rxjs';
import { MitigationActionsService } from './mitigation-actions.service';
import { I18nService } from '@app/i18n';
import { MAStates } from './mitigation-action';

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

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const id = route.params['id'];

    return new Promise((resolve) => {
      this.mitigationActionService.getMitigationAction(id, this.i18nService.language.split('-')[0]).subscribe({
        next: (ma) => {
          const canEdit = this.permissionService.canEditMA(ma.fsm_state.state as MAStates);
          resolve(canEdit || this.router.createUrlTree(['/unauthorized']));
        },
        error: () => resolve(this.router.createUrlTree(['/unauthorized'])),
      });
    });
  }
}
