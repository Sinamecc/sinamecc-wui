import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';

import { MitigationActionsListComponent } from '@app/mitigation-actions/mitigation-actions-list/mitigation-actions-list.component';
import { MitigationActionsNewComponent } from '@app/mitigation-actions/mitigation-actions-new/mitigation-actions-new.component';
import { MitigationActionComponent } from '@app/mitigation-actions/mitigation-action/mitigation-action.component';
import { MitigationActionsUpdateComponent } from '@app/mitigation-actions/mitigation-actions-update/mitigation-actions-update.component';
import { MitigationActionReviewsNewComponent } from '@app/mitigation-actions/mitigation-action-reviews/mitigation-action-reviews-new/mitigation-action-reviews-new.component';
import { MitigationActionsReviewsListComponent } from '@app/mitigation-actions/mitigation-action-reviews/mitigation-actions-reviews-list/mitigation-actions-reviews-list.component';
import { ConceptualIntegrationComponent } from '@app/mitigation-actions/conceptual-integration/conceptual-integration.component';
import { IngeiHarmonizationComponent } from '@app/mitigation-actions/ingei-harmonization/ingei-harmonization.component';
import { ConceptualIntegrationNewComponent } from '@app/mitigation-actions/conceptual-integration-new/conceptual-integration-new.component';
import { HarmonizationProposalNewComponent } from '@app/mitigation-actions/harmonization-proposal-new/harmonization-proposal-new.component';

const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: 'mitigation/actionst', pathMatch: 'full' },
    { path: 'mitigation/actions',
      component: MitigationActionsListComponent,
      data: { title: extract('MitigationActions') } },
    { path: 'mitigation/actions/new',
      component: MitigationActionsNewComponent, data: { title: extract('New') } },
    { path: 'mitigation/actions/:id',
      component: MitigationActionComponent, data: { id: extract('id') } },
    { path: 'mitigation/actions/:id/edit',
      component: MitigationActionsUpdateComponent, data: { id: extract('id') } },
    { path: 'mitigation/actions/:id/reviews/new',
      component: MitigationActionReviewsNewComponent, data: { id: extract('id') } },
    { path: 'mitigation/actions/:id/reviews',
      component: MitigationActionsReviewsListComponent, data: { id: extract('id') } },
    { path: 'mitigation/actions/:id/conceptual/integration',
      component: ConceptualIntegrationComponent, data: { id: extract('id') } },
    { path: 'mitigation/actions/:id/harmonization/integration',
      component: IngeiHarmonizationComponent,
      data: { id: extract('id') } },
    { path: 'mitigation/actions/:id/conceptual/integration/new',
      component: ConceptualIntegrationNewComponent,
      data: { id: extract('id') } },
    { path: 'mitigation/actions/:id/harmonization/proposal/new',
      component: HarmonizationProposalNewComponent,
      data: { id: extract('id') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MitigationActionsRoutingModule { }
