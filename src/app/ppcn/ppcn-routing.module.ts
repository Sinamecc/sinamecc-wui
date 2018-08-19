import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';
import { PpcnLevelComponent } from '@app/ppcn/ppcn-level/ppcn-level.component';
import { PpcnFlowComponent } from '@app/ppcn/ppcn-flow/ppcn-flow.component';

const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: 'mccr/registries', pathMatch: 'full' },
    { path: 'ppcn/geographic', component: PpcnLevelComponent, data: { title: extract('PpcnLevel') } },
    { path: 'ppcn/flow', component: PpcnFlowComponent, data: { title: extract('PpcnFlow') } }
  ])
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  exports: [RouterModule],
  providers: []
})
export class PpcnRoutingModule { }
