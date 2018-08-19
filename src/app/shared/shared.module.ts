import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from '@app/shared/loader/loader.component';
import { InputFileComponent } from '@app/shared/input-file/input-file.component';
import { ByteFormatPipe } from '@app/shared/input-file/byte-format.pipe';
import { DownloadProposalComponent } from '@app/shared/download-proposal/download-proposal.component';
import { UploadProposalComponent } from '@app/shared/upload-proposal/upload-proposal.component';
import { UploadProposalService } from '@app/shared/upload-proposal/upload-proposal.service';
import { UpdateStatusComponent } from '@app/shared/update-status/update-status.component';
import { UpdateStatusService } from '@app/shared/update-status/update-status.service';
@NgModule({
  imports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoaderComponent,
    InputFileComponent,
    ByteFormatPipe,
    DownloadProposalComponent,
    UploadProposalComponent,
    UpdateStatusComponent
  ],
  providers: [
    UploadProposalService,
    UpdateStatusService
  ],
  exports: [
    LoaderComponent,
    InputFileComponent,
    ByteFormatPipe,
    DownloadProposalComponent,
    UploadProposalComponent,
    UpdateStatusComponent
  ]
})
export class SharedModule { }
