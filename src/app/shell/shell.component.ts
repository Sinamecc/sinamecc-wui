import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Permissions } from '@app/@core/permissions';
import { AuthenticationService, CredentialsService, Credentials } from '@app/auth';
import { untilDestroyed } from '@core';
import { Router } from '@angular/router';
import { MobileService } from '@app/@shared/mobile.service';

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

  mobile_modules = [
    ...this.modules,
    {
      name: 'admin.users',
      url: '/admin/users',
      icon: 'supervised_user_circle',
      selected: false,
      module: 'admin',
    },
  ];

  @ViewChild('sidenav', { static: false }) sidenav!: MatSidenav;

  isMobile = false;
  toggle = false;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private mobileService: MobileService,
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        this.mobileService.setIsMobile(state.matches);
      });

    this.mobileService.isMobile$.pipe(untilDestroyed(this)).subscribe((isMobile) => {
      this.isMobile = isMobile;
      if (!isMobile && this.sidenav) {
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

  toggleMenu() {
    this.toggle = !this.toggle;
  }

  selectItem(modules: any[], index: number) {
    modules.forEach((x) => (x.selected = false));
    modules[index].selected = true;
    if (this.toggle) this.toggle = false;
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

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  ngOnDestroy() {}
}
