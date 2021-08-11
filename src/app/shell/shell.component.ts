import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';
import { Permissions } from '@app/@core/permissions';
import { AuthenticationService, CredentialsService, Credentials } from '@app/auth';

import { untilDestroyed } from '@core';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: false }) sidenav!: MatSidenav;

  constructor(
    private media: MediaObserver,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {}

  ngOnInit() {
    // Automatically close side menu on screens > sm breakpoint
    this.media
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) =>
          changes.some((change) => change.mqAlias !== 'xs' && change.mqAlias !== 'sm')
        ),
        untilDestroyed(this)
      )
      .subscribe(() => this.sidenav.close());
  }

  get permissions(): Permissions {
    return this.credentialsService.credentials.permissions;
  }

  get credential(): Credentials {
    return this.credentialsService.credentials;
  }

  showModule(permissions: Permissions, module: string) {
    if (permissions.all) {
      return true;
    } else {
      return Boolean(permissions[module]);
    }
  }

  ngOnDestroy() {
    // Needed for automatic unsubscribe with untilDestroyed
  }
}
