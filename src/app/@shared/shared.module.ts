import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';

import { CustomSearchBarComponent } from './custom-search-bar/custom-search-bar.component';
import { GenericButtonComponent } from './generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from './generic-button-secondary/generic-button-secondary.component';
import { InputFileComponent } from './input-file/input-file.component';
import { ByteFormatPipe } from './input-file/byte-format.pipe';
import { DownloadProposalComponent } from './download-proposal/download-proposal.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorReportingComponent } from './error-reporting/error-reporting.component';
import { ViewPdfComponent } from './view-pdf/view-pdf.component';
import { UpdateStatusComponent } from './update-status/update-status.component';
import { UploadProposalComponent } from './upload-proposal/upload-proposal.component';
import { UpdateStatusService } from './update-status/update-status.service';
import { UploadProposalService } from './upload-proposal/upload-proposal.service';
import { ViewPdfService } from './view-pdf/view-pdf.service';
import { S3Service } from './s3.service';
import { CommentsViewComponent } from './comments-view/comments-view.component';
import { CommentsAddComponent } from './comments-add/comments-add.component';
import { ChangeLogViewComponent } from './change-log-view/change-log-view.component';
@NgModule({
  imports: [MaterialModule, CommonModule, TranslateModule, FormsModule, ReactiveFormsModule],
  declarations: [
    LoaderComponent,
    InputFileComponent,
    ByteFormatPipe,
    DownloadProposalComponent,
    UploadProposalComponent,
    UpdateStatusComponent,
    GenericButtonComponent,
    GenericButtonSecondaryComponent,
    CustomSearchBarComponent,
    ErrorReportingComponent,
    ViewPdfComponent,
    CommentsViewComponent,
    CommentsAddComponent,
    ChangeLogViewComponent,
  ],
  providers: [UploadProposalService, UpdateStatusService, ViewPdfService, S3Service],
  exports: [
    LoaderComponent,
    InputFileComponent,
    ByteFormatPipe,
    DownloadProposalComponent,
    UploadProposalComponent,
    UpdateStatusComponent,
    GenericButtonComponent,
    GenericButtonSecondaryComponent,
    CustomSearchBarComponent,
    ErrorReportingComponent,
    ViewPdfComponent,
    CommentsViewComponent,
    CommentsAddComponent,
    ChangeLogViewComponent,
  ],
})
export class SharedModule {}
