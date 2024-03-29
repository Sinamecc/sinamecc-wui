import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { extract } from '@app/i18n';
import { RouteService as Route } from '@app/route.service';
import { AdaptationActionReviewComponent } from './adaptation-action-review/adaptation-action-review.component';
import { AdaptationActionsListComponent } from './adaptation-actions-list/adaptation-actions-list.component';
import { AdaptationActionsNewComponent } from './adaptation-actions-new/adaptation-actions-new.component';
import { AdaptationActionsViewComponent } from './adaptation-actions-view/adaptation-actions-view.component';

const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: 'adaptation/actions', pathMatch: 'full' },
    {
      path: 'adaptation/actions',
      component: AdaptationActionsListComponent,
      data: { title: extract('Nueva acción de adaptación') },
    },
    {
      path: 'adaptation/actions/new',
      component: AdaptationActionsNewComponent,
      data: { title: extract('Lista de acciones de adaptación') },
    },
    {
      path: 'adaptation/actions/:id',
      component: AdaptationActionsViewComponent,
      data: { id: extract('id') },
    },
    {
      path: 'adaptation/actions/:id/reviews/new',
      component: AdaptationActionReviewComponent,
      data: { id: extract('id') },
    },
    {
      path: 'adaptation/actions/:id/update',
      component: AdaptationActionsNewComponent,
      data: { id: extract('id') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdaptationActionsRoutingModule {}
