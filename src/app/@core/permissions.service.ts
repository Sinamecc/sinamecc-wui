import { Injectable } from '@angular/core';
import { States } from '@app/@shared/next-state';
import { CredentialsService } from '@app/auth';
import { Permissions } from '@core/permissions';

export const EDITABLE_MA = [States.NEW, States.REQUESTED_CHANGES_BY_DCC];
export const DELETABLE_MA = [States.NEW, States.REJECTED_BY_DCC];

export const EDITABLE_AA = [States.NEW, States.REQUESTED_CHANGES_BY_DCC, States.UPDATING_BY_REQUEST_DCC];
export const DELETABLE_AA = [States.NEW];

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

  canChangeMAState(state: States): boolean {
    if (state === States.END) return false;
    return Boolean(this.hasAdminPermission() || this.hasReviewerPermission() || this.permissions.ma?.reviewer);
  }

  canEditMA(state: States): boolean {
    if (this.hasAllPermissions()) return true;
    return Boolean(this.permissions.ma?.provider && EDITABLE_MA.includes(state));
  }

  canEditAcceptedMA(state: States): boolean {
    if (this.hasAllPermissions()) return true;
    return Boolean(this.permissions.ma?.provider && state === States.ACCEPTED_BY_DCC);
  }

  canDeleteMA(state: States): boolean {
    if (this.hasAllPermissions()) return true;
    return Boolean(this.permissions.ma?.provider && DELETABLE_MA.includes(state));
  }

  // Adaption Actions Permissions
  isAAProvider(): boolean {
    return Boolean(this.hasAdminPermission() || this.hasProviderPermission() || this.permissions.aa?.provider);
  }

  canChangeAAState(state: States): boolean {
    if (state === States.END) return false;
    return Boolean(this.hasAdminPermission() || this.hasReviewerPermission() || this.permissions.aa?.reviewer);
  }

  canEditAA(state: States): boolean {
    if (this.hasAllPermissions()) return true;
    return Boolean(this.permissions.aa?.provider && EDITABLE_AA.includes(state));
  }

  canEditAcceptedAA(state: States): boolean {
    if (this.hasAllPermissions()) return true;
    return Boolean(this.permissions.aa?.provider && state === States.ACCEPTED_BY_DCC);
  }

  canDeleteAA(state: States): boolean {
    if (this.hasAllPermissions()) return true;
    return Boolean(this.permissions.aa?.provider && DELETABLE_AA.includes(state));
  }
}
