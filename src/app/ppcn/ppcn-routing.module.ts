import { NgModule } from '@angular/core';
import { RouteService as Route } from '@app/route.service';
import { extract } from '@app/i18n';

import { Routes, RouterModule } from '@angular/router';
import { PpcnLevelComponent } from '@app/ppcn/ppcn-level/ppcn-level.component';
import { PpcnFlowComponent } from '@app/ppcn/ppcn-flow/ppcn-flow.component';
import { PpcnListComponent } from '@app/ppcn/ppcn-list/ppcn-list.component';
import { PpcnComponent } from '@app/ppcn/ppcn/ppcn.component';
import { PpcnDownloadComponent } from '@app/ppcn/ppcn-download/ppcn-download.component';
import { PpcnUploadComponent } from '@app/ppcn/ppcn-upload/ppcn-upload.component';
import { FileVersionComponent } from '@app/ppcn/file-version/file-version.component';
import { NewReviewComponent } from '@app/ppcn/ppcn-reviews/new-review/new-review.component';
import { ReviewsListComponent } from '@app/ppcn/ppcn-reviews/reviews-list/reviews-list.component';
import { ViewPdfComponent } from '@shared/view-pdf/view-pdf.component';

const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: 'ppcn/registries', pathMatch: 'full' },
    {
      path: 'ppcn/flow',
      component: PpcnFlowComponent,
      data: { title: extract('PpcnFlow') },
    },
    {
      path: 'ppcn/registries',
      component: PpcnListComponent,
      data: { title: extract('ppcn.ppcnList') },
    },
    {
      path: 'ppcn/registries/new',
      component: PpcnFlowComponent,
      data: { title: extract('ppcn.createPPCN') },
    },
    { path: 'ppcn/:id', component: PpcnComponent, data: { id: extract('id') } },
    {
      path: 'ppcn/geographic',
      component: PpcnLevelComponent,
      data: { title: extract('PpcnLevel') },
    },
    {
      path: 'ppcn/:id/download/:geographic',
      component: PpcnDownloadComponent,
      data: { id: extract('id') },
    },
    {
      path: 'ppcn/:id/upload/new',
      component: PpcnUploadComponent,
      data: { id: extract('id') },
    },
    {
      path: 'ppcn/:id/file/version/new',
      component: FileVersionComponent,
      data: { id: extract('id') },
    },
    {
      path: 'ppcn/:id/review/status/new',
      component: NewReviewComponent,
      data: { id: extract('id') },
    },
    {
      path: 'ppcn/:id/reviews',
      component: ReviewsListComponent,
      data: { id: extract('id') },
    },
    {
      path: 'ppcn/registries/edit/:id',
      component: PpcnFlowComponent,
      data: { title: extract('ppcn.createPPCN') },
    },
    {
      path: 'ppcn/:moduleID/view/file/:id',
      component: ViewPdfComponent,
      data: { title: extract('PPCN PDF') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PpcnRoutingModule {}
