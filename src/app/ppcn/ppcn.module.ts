import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { PpcnRoutingModule } from '@app/ppcn/ppcn-routing.module';
import { PpcnListComponent } from './ppcn-list/ppcn-list.component';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { PpcnLevelComponent } from './ppcn-level/ppcn-level.component';
import { PpcnNewComponent } from './ppcn-new/ppcn-new.component';
import { GasReportTableComponent } from './gas-report-table/gas-report-table.component';
import { PpcnUploadComponent } from './ppcn-upload/ppcn-upload.component';
import { PpcnFlowComponent } from './ppcn-flow/ppcn-flow.component';
import { PpcnComponent } from './ppcn/ppcn.component';
import { PpcnDownloadComponent } from './ppcn-download/ppcn-download.component';
import { FileVersionComponent } from './file-version/file-version.component';
import { ReviewsListComponent } from './ppcn-reviews/reviews-list/reviews-list.component';
import { NewReviewComponent } from './ppcn-reviews/new-review/new-review.component';
import { GenericDialogBoxComponent } from './generic-dialog-box/generic-dialog-box.component';
@NgModule({
  declarations: [
    PpcnLevelComponent,
    PpcnFlowComponent,
    PpcnNewComponent,
    PpcnDownloadComponent,
    PpcnUploadComponent,
    PpcnComponent,
    PpcnListComponent,
    FileVersionComponent,
    NewReviewComponent,
    ReviewsListComponent,
    GasReportTableComponent,
    GenericDialogBoxComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MaterialModule,
    PpcnRoutingModule,
  ],
  providers: [PpcnService, DatePipe],
})
export class PpcnModule {}
