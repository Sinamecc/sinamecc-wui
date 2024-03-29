import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/i18n';
import { RouteService as Route } from '@app/route.service';

import { MccrRegistriesListComponent } from '@app/mccr/mccr-registries/mccr-registries-list/mccr-registries-list.component';
import { MccrRegistriesNewComponent } from '@app/mccr/mccr-registries/mccr-registries-new/mccr-registries-new.component';
import { MccrRegistryComponent } from '@app/mccr/mccr-registries/mccr-registry/mccr-registry.component';
import { MccrRegistriesUpdateComponent } from '@app/mccr/mccr-registries/mccr-registries-update/mccr-registries-update.component';
import { MccrRegistriesOvvSelectorComponent } from '@app/mccr/mccr-registries/mccr-registries-ovv-selector/mccr-registries-ovv-selector.component';
import { MccrRegistriesReviewComponent } from './mccr-registries-review/mccr-registries-review.component';
import { OvvProposalComponent } from './ovv-proposal/ovv-proposal.component';
import { OvvProposalNewComponent } from './ovv-proposal-new/ovv-proposal-new.component';
import { MonitoringProposalNewComponent } from './monitoring-proposal-new/monitoring-proposal-new.component';
import { MonitoringProposalVerificationNewComponent } from './monitoring-proposal-verification-new/monitoring-proposal-verification-new.component';

const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: 'mccr/registries', pathMatch: 'full' },
    {
      path: 'mccr/registries',
      component: MccrRegistriesListComponent,
      data: { title: extract('mccr.MCCRRegistries') },
    },
    {
      path: 'mccr/registries/new',
      component: MccrRegistriesNewComponent,
      data: { title: extract('mccr.createMCCR') },
    },
    {
      path: 'mccr/registries/:id',
      component: MccrRegistryComponent,
      data: { id: extract('id') },
    },
    {
      path: 'mccr/registries/:id/edit',
      component: MccrRegistriesUpdateComponent,
      data: { id: extract('id') },
    },
    {
      path: 'mccr/registries/:id/ovv',
      component: MccrRegistriesOvvSelectorComponent,
      data: { id: extract('id') },
    },
    {
      path: 'mccr/registries/:id/reviews/new',
      component: MccrRegistriesReviewComponent,
      data: { id: extract('id') },
    },
    {
      path: 'mccr/registries/:id/ovv/proposal',
      component: OvvProposalComponent,
      data: { id: extract('id') },
    },
    {
      path: 'mccr/registries/:id/ovv/proposal/new',
      component: OvvProposalNewComponent,
      data: { id: extract('id') },
    },
    {
      path: 'mccr/registries/:id/monitoring/proposal/new',
      component: MonitoringProposalNewComponent,
      data: { id: extract('id') },
    },
    {
      path: 'mccr/registries/:id/monitoring/verification/proposal/new',
      component: MonitoringProposalVerificationNewComponent,
      data: { id: extract('id') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MccrRegistriesRoutingModule {}
