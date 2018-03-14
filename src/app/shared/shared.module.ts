import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
import { InputFileComponent } from './input-file/input-file.component';
import { ByteFormatPipe } from './input-file/byte-format.pipe';
@NgModule({
  imports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoaderComponent,
    InputFileComponent,
    ByteFormatPipe
  ],
  exports: [
    LoaderComponent,
    InputFileComponent,
    ByteFormatPipe
  ]
})
export class SharedModule { }
