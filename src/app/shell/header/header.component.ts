import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

import { AuthenticationService, CredentialsService, Credentials } from '@app/auth';
import { I18nService } from '@app/i18n/i18n.service';
import { Permissions } from '@app/@core/permissions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit {
  logoName: string;
  @Input() sidenav!: MatSidenav;

  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private i18nService: I18nService,
  ) {
    this.logoName = 'logo-white-nav.png';
  }

  ngOnInit() {}

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get permissions(): Permissions {
    return this.credentialsService.credentials.permissions;
  }

  get credential(): Credentials {
    return this.credentialsService.credentials;
  }

  get title(): string {
    return this.titleService.getTitle();
  }

  get groups(): object {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.groups : null;
  }

  showModule(permissions: Permissions, module: string) {
    if (permissions.all) {
      return true;
    } else {
      return Boolean(permissions[module]);
    }
  }
}
