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

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const id = route.params['id'];

    return new Promise((resolve) => {
      this.adaptationActionService.loadOneAdaptationActions(id).subscribe({
        next: (aa) => {
          const canEdit = this.permissionService.canEditAA(aa.fsm_state.state as States);
          resolve(canEdit || this.router.createUrlTree(['/unauthorized']));
        },
        error: () => resolve(this.router.createUrlTree(['/unauthorized'])),
      });
    });
  }
}
