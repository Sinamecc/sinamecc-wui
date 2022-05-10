import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MccrPocRoutingModule } from '@app/mccr/mccr-poc/mccr-poc-routing.module';
import { MccrPocService } from '@app/mccr/mccr-poc/mccr-poc.service';
import { MccrPocListComponent } from './mccr-poc-list/mccr-poc-list.component';
import { MccrSearchPocComponent } from './mccr-search-poc/mccr-search-poc.component';
import { MccrPocNewDeveloperAccountComponent } from './mccr-poc-new-developer-account/mccr-poc-new-developer-account.component';
import { MccrPocNewBuyerAccountComponent } from './mccr-poc-new-buyer-account/mccr-poc-new-buyer-account.component';
import { MccrPocAddBuyerComponent } from './mccr-poc-add-buyer/mccr-poc-add-buyer.component';
import { MccrPocAddDeveloperComponent } from './mccr-poc-add-developer/mccr-poc-add-developer.component';
import { MccrPocAddPocComponent } from './mccr-poc-add-poc/mccr-poc-add-poc.component';
import { UccVerifyDataComponent } from './ucc-verify-data/ucc-verify-data.component';

@NgModule({
  declarations: [
    MccrPocListComponent,
    MccrSearchPocComponent,
    MccrPocNewDeveloperAccountComponent,
    MccrPocNewBuyerAccountComponent,
    MccrPocAddBuyerComponent,
    MccrPocAddDeveloperComponent,
    MccrPocAddPocComponent,
    UccVerifyDataComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    MccrPocRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  entryComponents: [MccrPocNewDeveloperAccountComponent, MccrPocNewBuyerAccountComponent, UccVerifyDataComponent],
  providers: [MccrPocService],
})
export class MccrPocModule {}
