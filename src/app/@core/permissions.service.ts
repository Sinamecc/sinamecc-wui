import { Injectable } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { MAStates } from '@app/mitigation-actions/mitigation-action';
import { Permissions } from '@core/permissions';

export const EDITABLE_MA = [MAStates.NEW, MAStates.REQUESTED_CHANGES_BY_DCC];
export const DELETABLE_MA = [MAStates.NEW, MAStates.REJECTED_BY_DCC];

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private credentialsService: CredentialsService) {}

  private get permissions(): Permissions {
    return this.credentialsService.credentials.permissions;
  }

  hasAllPermissions(): boolean {
    return (
      this.permissions.all &&
      (this.permissions.all.admin || this.permissions.all.provider || this.permissions.all.reviewer)
    );
  }

  hasAdminPermission(): boolean {
    return this.permissions.all && this.permissions.all.admin;
  }

  hasReviewerPermission(): boolean {
    return this.permissions.all && this.permissions.all.reviewer;
  }

  hasProviderPermission(): boolean {
    return (this.permissions.all && this.permissions.all.provider) || this.permissions.ma.provider;
  }

  hasMAPermission(): boolean {
    return this.hasAllPermissions() || this.permissions.ma.provider || this.permissions.ma.reviewer;
  }

  isMAProvider() {
    return Boolean(this.hasAdminPermission() || this.credentialsService.credentials.permissions.ma.provider);
  }

  canChangeMAState(state: MAStates) {
    if (state !== MAStates.END) {
      if (this.credentialsService.credentials.permissions.all) {
        return true;
      } else {
        if (!this.credentialsService.credentials.permissions.ma.provider) {
          return true;
        }
      }
    }
    return false;
  }

  canEditMA(state: MAStates): boolean {
    if (this.hasAllPermissions()) return true;
    return this.permissions.ma.provider && EDITABLE_MA.includes(state);
  }

  canDeleteMA(state: MAStates): boolean {
    if (this.hasAllPermissions()) return true;

    return this.permissions.ma.provider && DELETABLE_MA.includes(state);
  }
}
