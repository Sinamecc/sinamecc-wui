import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';

import { MccrRegistriesListComponent } from '@app/mccr/mccr-registries/mccr-registries-list/mccr-registries-list.component';
import { MccrRegistriesNewComponent } from '@app/mccr/mccr-registries/mccr-registries-new/mccr-registries-new.component';
import { MccrRegistryComponent } from '@app/mccr/mccr-registries/mccr-registry/mccr-registry.component';
import { MccrRegistriesUpdateComponent } from '@app/mccr/mccr-registries/mccr-registries-update/mccr-registries-update.component';
import { MaterialModule } from '@app/material.module';
import { MccrRegistriesOvvSelectorComponent } from '@app/mccr/mccr-registries/mccr-registries-ovv-selector/mccr-registries-ovv-selector.component';
import { MccrRegistriesReviewComponent } from './mccr-registries-review/mccr-registries-review.component';
import { OvvProposalComponent } from './ovv-proposal/ovv-proposal.component';
import { OvvProposalNewComponent } from './ovv-proposal-new/ovv-proposal-new.component';



const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: 'mccr/registries', pathMatch: 'full' },
    { path: 'mccr/registries', component: MccrRegistriesListComponent, data: { title: extract('MccrRegistry') } },
    { path: 'mccr/registries/new', component: MccrRegistriesNewComponent, data: { title: extract('New') } },
    { path: 'mccr/registries/:id', component: MccrRegistryComponent, data: { id: extract('id') } },
    { path: 'mccr/registries/:id/edit', component: MccrRegistriesUpdateComponent, data: { id: extract('id') } },
    { path: 'mccr/registries/:id/ovv', component: MccrRegistriesOvvSelectorComponent, data: { id: extract('id') } },
    { path: 'mccr/registries/:id/reviews/new', component: MccrRegistriesReviewComponent, data: { id: extract('id') } },
    { path: 'mccr/registries/:id/ovv/proposal', component: OvvProposalComponent, data: { id: extract('id') } },
    { path: 'mccr/registries/:id/ovv/proposal/new', component: OvvProposalNewComponent, data: { id: extract('id') } },

  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class MccrRegistriesRoutingModule { }