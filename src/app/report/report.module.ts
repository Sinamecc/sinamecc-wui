import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';


import { MaterialModule } from '@app/material.module';
import { ReportRoutingModule } from '@app/report/report-routing.module';
import { ReportComponent } from '@app/report/report.component';
import { ReportService } from '@app/report/report.service';
import { ReportNewComponent } from '@app/report/report-new/report-new.component';
import { ReportVersionsComponent } from '@app/report/report-versions/report-versions.component';
import { ReportVersionsNewComponent } from '@app/report/report-versions-new/report-versions-new.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    ReportRoutingModule
  ],
  declarations: [
    ReportComponent,
    ReportNewComponent,
    ReportVersionsComponent,
    ReportVersionsNewComponent
  ],
  providers: [ReportService]
})

export class ReportModule { }
