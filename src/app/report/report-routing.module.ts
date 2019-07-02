import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { ReportComponent } from '@app/report/report.component';
import { ReportVersionsComponent } from '@app/report/report-versions/report-versions.component';
import { ReportNewComponent } from '@app/report/report-new/report-new.component';
import { ReportVersionsNewComponent } from '@app/report/report-versions-new/report-versions-new.component';

const routes: Routes = [
  // Module is lazy loaded, see app-routing.module.ts
  { path: '', redirectTo: '/home',  pathMatch: 'full' },
  { path: '',component: ReportComponent, data: { title: extract('Report') } },
  { path: ':id/versions', component: ReportVersionsComponent, data: { id: extract('id') } },
  { path: 'new', component: ReportNewComponent, data: { title: extract('New') } },
  { path: ':id/versions/new', component: ReportVersionsNewComponent, data: { title: extract('New') } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule { }
