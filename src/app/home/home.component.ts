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
        })
      ),
      transition('void <=> *', animate(1000)),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  data = [
    {
      name: 'Acciones de mitigación',
      urlNew: '/mitigation/actions/new',
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
      urlNew: '/adaptation/actions/new',
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
      urlNew: '/report/new',
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
      urlNew: '/ppcn/registries/new',
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
      urlNew: '/mccr/registries/new',
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
    private credentialsService: CredentialsService
  ) {}

  ngOnInit() {}

  goToSite(url: string) {
    this.router.navigate([url], { replaceUrl: true });
  }

  get permissions(): Permissions {
    return this.credentialsService.credentials.permissions;
  }

  showModule(permissions: Permissions, module: string) {
    if (permissions.all) {
      return true;
    } else {
      return Boolean(permissions[module]);
    }
  }
}
