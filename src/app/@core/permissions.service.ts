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
    const all = this.permissions.all;
    return Boolean(all?.admin || all?.provider || all?.reviewer);
  }

  hasAdminPermission(): boolean {
    return Boolean(this.permissions.all?.admin);
  }

  hasReviewerPermission(): boolean {
    return Boolean(this.permissions.all?.reviewer);
  }

  hasProviderPermission(): boolean {
    return Boolean(this.permissions.all?.provider);
  }

  hasMAPermission(): boolean {
    return this.hasAllPermissions() || Boolean(this.permissions.ma?.provider || this.permissions.ma?.reviewer);
  }

  // Mitigation Actions Permissions

  isMAProvider(): boolean {
    return Boolean(this.hasAdminPermission() || this.hasProviderPermission() || this.permissions.ma?.provider);
  }

  canChangeMAState(state: MAStates): boolean {
    if (state === MAStates.END) return false;
    return Boolean(this.hasAdminPermission() || this.hasReviewerPermission() || this.permissions.ma?.reviewer);
  }

  canEditMA(state: MAStates): boolean {
    if (this.hasAllPermissions()) return true;
    return Boolean(this.permissions.ma?.provider && EDITABLE_MA.includes(state));
  }

  canDeleteMA(state: MAStates): boolean {
    if (this.hasAllPermissions()) return true;
    return Boolean(this.permissions.ma?.provider && DELETABLE_MA.includes(state));
  }
}
