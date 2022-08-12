import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';
import { Permissions } from '@app/@core/permissions';
import { AuthenticationService, CredentialsService, Credentials } from '@app/auth';

import { untilDestroyed } from '@core';
import { I18nService } from '@app/i18n';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy {
  logoSINAMECC = 'assets/SINAMECC-logo-vaciado.svg';
  modules = [
    {
      name: 'Inicio',
      url: '/',
      icon: 'home',
      selected: false,
    },
    {
      name: 'PPCN',
      url: '/ppcn/registries',
      icon: 'group_work',
      selected: false,
    },
    {
      name: 'mitigationAction.MAs',
      url: '/mitigation/actions',
      icon: 'whatshot',
      selected: false,
    },
    {
      name: 'Acciones de Adaptación',
      url: '/adaptation/actions',
      icon: 'present_to_all',
      selected: false,
    },
    {
      name: 'reportData.reportsM',
      url: '/report',
      icon: 'present_to_all',
      selected: false,
    },
    {
      name: 'MCCR - UCC',
      url: '/mccr/poc',
      icon: 'settings_overscan',
      selected: false,
    },
    {
      name: 'MCCR',
      url: '/mccr/registries',
      icon: 'schedule_send',
      selected: false,
    },
  ];

  @ViewChild('sidenav', { static: false }) sidenav!: MatSidenav;

  constructor(
    private router: Router,
    private media: MediaObserver,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private i18nService: I18nService
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

  selectItem(index: number) {
    this.modules.forEach((x) => (x.selected = false));
    this.modules[index].selected = true;
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }

  get fullName(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.fullName : null;
  }

  get email(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.email : null;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  ngOnDestroy() {
    // Needed for automatic unsubscribe with untilDestroyed
  }
}
