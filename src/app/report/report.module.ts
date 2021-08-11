import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@shared';

import { MaterialModule } from '@app/material.module';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from '@app/report/report.component';
import { ReportService } from '@app/report/report.service';
import { ReportNewComponent } from './report-new/report-new.component';
import { ReportVersionsComponent } from './report-versions/report-versions.component';
import { ReportVersionsNewComponent } from './report-versions-new/report-versions-new.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    ReportRoutingModule,
  ],
  declarations: [ReportComponent, ReportNewComponent, ReportVersionsComponent, ReportVersionsNewComponent],
  providers: [ReportService],
})
export class ReportModule {}
