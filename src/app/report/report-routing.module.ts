import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { ReportComponent } from './report.component';

const routes: Routes = [
  { path: 'report', component: ReportComponent, data: { title: extract('Report') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ReportRoutingModule { }
