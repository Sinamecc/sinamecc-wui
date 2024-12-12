import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@shared';

import { MaterialModule } from '@app/material.module';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from '@app/report/report.component';
import { ReportService } from '@app/report/report.service';
import { ReportNewComponent } from './report-new/report-new.component';
import { ReportVersionsComponent } from './report-versions/report-versions.component';
import { ReportVersionsNewComponent } from './report-versions-new/report-versions-new.component';
import { ReportFormDataComponent } from './report-form-data/report-form-data.component';
import { MethodoloficalSheetComponent } from './methodolofical-sheet/methodolofical-sheet.component';
import { DataUpdateComponent } from './data-update/data-update.component';
import { ReportViewComponent } from './report-view/report-view.component';
import { ReportReviewComponent } from './report-review/report-review.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    MaterialModule,
    ReportRoutingModule,
  ],
  declarations: [
    ReportComponent,
    ReportNewComponent,
    ReportVersionsComponent,
    ReportVersionsNewComponent,
    ReportFormDataComponent,
    MethodoloficalSheetComponent,
    DataUpdateComponent,
    ReportViewComponent,
    ReportReviewComponent,
  ],
  providers: [ReportService],
})
export class ReportModule {}
