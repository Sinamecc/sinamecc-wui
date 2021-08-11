import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { PpcnUpdateComponent } from './ppcn-update/ppcn-update.component';
import { PpcnDownloadComponent } from './ppcn-download/ppcn-download.component';
import { FileVersionComponent } from './file-version/file-version.component';
import { UploadProposalComponent } from '@app/ppcn/upload-proposal/upload-proposal.component';
import { UploadProposalService } from '@app/ppcn/upload-proposal/upload-proposal.service';
import { UpdateStatusComponent } from '@app/ppcn/update-status/update-status.component';
import { UpdateStatusService } from '@app/ppcn/update-status/update-status.service';
import { ReviewsListComponent } from './ppcn-reviews/reviews-list/reviews-list.component';
import { NewReviewComponent } from './ppcn-reviews/new-review/new-review.component';

@NgModule({
  declarations: [
    PpcnListComponent,
    PpcnLevelComponent,
    PpcnNewComponent,
    GasReportTableComponent,
    PpcnUploadComponent,
    PpcnFlowComponent,
    PpcnComponent,
    PpcnUpdateComponent,
    PpcnDownloadComponent,
    FileVersionComponent,
    UploadProposalComponent,
    UpdateStatusComponent,
    ReviewsListComponent,
    NewReviewComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    PpcnRoutingModule,
  ],
  providers: [PpcnService, DatePipe, UploadProposalService, UpdateStatusService],
})
export class PpcnModule {}
