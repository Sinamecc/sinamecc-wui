import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Router } from '@angular/router';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { Permissions } from '@app/@core/permissions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        }),
      ),
      transition('void <=> *', animate(1000)),
    ]),
  ],
  standalone: false,
})
export class HomeComponent implements OnInit {
  data = [
    {
      name: 'Acciones de mitigación',
      module: 'ma',
      urlNew: '/mitigation/actions/new',
      urlView: '/mitigation/actions',
      cards: [
        {
          name: 'Solicutudes pendientes de revisión',
          value: '2',
          icon: '',
        },
        {
          name: 'Solicitud en revisión',
          value: '',
          icon: 'schedule',
        },
      ],
    },
    {
      name: 'Acciones de adaptación',
      module: 'aa',
      urlNew: '/adaptation/actions/new',
      urlView: '/adaptation/actions',
      cards: [
        {
          name: 'Solicutudes pendientes de revisión',
          value: '2',
          icon: '',
        },
        {
          name: 'Solicitud en revisión',
          value: '',
          icon: 'schedule',
        },
      ],
    },
    {
      name: 'Reportes de datos',
      module: 'rd',
      urlNew: '/report/new',
      urlView: '/report',
      cards: [
        {
          name: 'Solicutudes pendientes de revisión',
          value: '2',
          icon: '',
        },
        {
          name: 'Solicitud en revisión',
          value: '',
          icon: 'schedule',
        },
      ],
    },
    {
      name: 'Registro PPCN',
      module: 'ppcn',
      urlNew: '/ppcn/registries/new',
      urlView: '/ppcn/registries',
      cards: [
        {
          name: 'Solicutudes pendientes de revisión',
          value: '2',
          icon: '',
        },
        {
          name: 'Solicitud en revisión',
          value: '',
          icon: 'schedule',
        },
      ],
    },
    {
      name: 'MCCR',
      module: 'mccr',
      urlNew: '/mccr/registries/new',
      urlView: '/mccr/registries',
      cards: [
        {
          name: 'Solicutudes pendientes de revisión',
          value: '2',
          icon: '',
        },
        {
          name: 'Solicitud en revisión',
          value: '',
          icon: 'schedule',
        },
      ],
    },
  ];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
  ) {}

  ngOnInit() {}

  goToSite(url: string) {
    this.router.navigate([url], { replaceUrl: true });
  }

  get permissions(): Permissions {
    return this.credentialsService.credentials.permissions;
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

  hasPermProvider(module: string) {
    if (this.credentialsService.credentials.permissions.all) {
      return true;
    } else {
      if (this.credentialsService.credentials.permissions[module]) {
        return Boolean(this.credentialsService.credentials.permissions[module].provider);
      } else {
        return false;
      }
    }
  }
}
