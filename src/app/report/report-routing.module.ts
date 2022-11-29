import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/i18n';
import { ReportComponent } from '@app/report/report.component';
import { ReportNewComponent } from '@app/report/report-new/report-new.component';
import { ReportViewComponent } from './report-view/report-view.component';
import { ReportReviewComponent } from './report-review/report-review.component';

const routes: Routes = [
  {
    path: 'reviews/:id/new',
    component: ReportReviewComponent,
    data: { id: extract('id') },
  },
  { path: '', component: ReportComponent, data: { title: extract('Reportes') } },
  { path: 'new', component: ReportNewComponent, data: { title: extract('Nuevo reporte') } },
  { path: 'edit/:id', component: ReportNewComponent, data: { title: extract('Editar Reporte') } },
  { path: 'view/:id', component: ReportViewComponent, data: { title: extract('Reporte') } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
