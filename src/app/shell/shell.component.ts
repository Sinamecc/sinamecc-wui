import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Permissions } from '@app/@core/permissions';
import { AuthenticationService, CredentialsService, Credentials } from '@app/auth';
import { untilDestroyed } from '@core';
import { I18nService } from '@app/i18n';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  standalone: false,
})
export class ShellComponent implements OnInit, OnDestroy {
  logoSINAMECC = 'assets/SINAMECC-logo-vaciado.svg';
  modules = [
    {
      name: 'Inicio',
      url: '/',
      icon: 'home',
      selected: false,
      module: '',
    },
    {
      name: 'PPCN',
      url: '/ppcn/registries',
      icon: 'group_work',
      selected: false,
      module: 'ppcn',
    },
    {
      name: 'mitigationAction.MAs',
      url: '/mitigation/actions',
      icon: 'whatshot',
      selected: false,
      module: 'ma',
    },
    {
      name: 'Acciones de Adaptación',
      url: '/adaptation/actions',
      icon: 'present_to_all',
      selected: false,
      module: 'aa',
    },
    {
      name: 'reportData.reportsM',
      url: '/report',
      icon: 'present_to_all',
      selected: false,
      module: 'rd',
    },
    {
      name: 'MCCR - UCC',
      url: '/mccr/poc',
      icon: 'settings_overscan',
      selected: false,
      module: 'mccr',
    },
    {
      name: 'MCCR',
      url: '/mccr/registries',
      icon: 'schedule_send',
      selected: false,
      module: 'mccr',
    },
  ];

  @ViewChild('sidenav', { static: false }) sidenav!: MatSidenav;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private i18nService: I18nService,
  ) {}

  ngOnInit() {
    // Automatically close side menu on screens > sm breakpoint
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        if (!state.matches && this.sidenav) {
          this.sidenav.close();
        }
      });
  }

  get permissions(): Permissions {
    return this.credentialsService.credentials.permissions;
  }

  get credential(): Credentials {
    return this.credentialsService.credentials;
  }

  showModule(permissions: Permissions, module: string) {
    if (module) {
      if (permissions.all) {
        return true;
      } else {
        return Boolean(permissions[module]);
      }
    } else {
      return true;
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
