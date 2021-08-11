import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';

import { CustomSearchBarComponent } from './custom-search-bar/custom-search-bar.component';
import { GenericButtonComponent } from './generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from './generic-button-secondary/generic-button-secondary.component';
import { InputFileComponent } from '@shared/input-file/input-file.component';
import { ByteFormatPipe } from '@shared/input-file/byte-format.pipe';
import { DownloadProposalComponent } from './download-proposal/download-proposal.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [FlexLayoutModule, MaterialModule, CommonModule, TranslateModule, FormsModule, ReactiveFormsModule],
  declarations: [
    LoaderComponent,
    CustomSearchBarComponent,
    GenericButtonComponent,
    InputFileComponent,
    ByteFormatPipe,
    GenericButtonSecondaryComponent,
    DownloadProposalComponent,
  ],
  exports: [
    LoaderComponent,
    CustomSearchBarComponent,
    GenericButtonComponent,
    InputFileComponent,
    ByteFormatPipe,
    GenericButtonSecondaryComponent,
    DownloadProposalComponent,
  ],
})
export class SharedModule {}
