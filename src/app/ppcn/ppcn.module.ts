import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { PpcnService } from '@app/ppcn/ppcn.service';
import { PpcnLevelComponent } from '@app/ppcn/ppcn-level/ppcn-level.component';
import { PpcnRoutingModule } from '@app/ppcn/ppcn-routing.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    PpcnRoutingModule
  ],
  declarations: [
    PpcnLevelComponent
  ],
  providers: [
    PpcnService,
    DatePipe
  ]
})
export class PpcnModule { }
