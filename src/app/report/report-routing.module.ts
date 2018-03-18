import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { ReportComponent } from './report.component';
import { ReportVersionsComponent } from '@app/report/report-versions/report-versions.component';
import { ReportNewComponent } from '@app/report/report-new/report-new.component';


const routes: Routes = [
  // Module is lazy loaded, see app-routing.module.ts
  { path: '', component: ReportComponent, data: { title: extract('Report') } },
  { path: ':id/versions', component: ReportVersionsComponent, data: { id: extract('id') } },
  { path: 'new', component: ReportNewComponent, data: { title: extract('New') } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ReportRoutingModule { }
