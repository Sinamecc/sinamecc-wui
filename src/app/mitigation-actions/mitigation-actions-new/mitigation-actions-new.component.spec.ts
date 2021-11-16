import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionsNewComponent } from '@app/mitigation-actions/mitigation-actions-new/mitigation-actions-new.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MitigationActionFormFlowComponent } from '../mitigation-action-form-flow/mitigation-action-form-flow.component';
import { ImpactFormComponent } from '../impact-form/impact-form.component';
import { EmissionsMitigationFormComponent } from '../emissions-mitigation-form/emissions-mitigation-form.component';
import { KeyAspectsFormComponent } from '../key-aspects-form/key-aspects-form.component';
import { BasicInformationFormComponent } from '../basic-information-form/basic-information-form.component';
import { InitiativeFormComponent } from '../initiative-form/initiative-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MockMitigationActionsService } from '../mitigation-actions.service.mock';
import { SharedModule, MockS3Service } from '@shared';
import { DatePipe } from '@angular/common';
import { I18nService } from '@app/i18n';
import { MockI18nService } from '@app/i18n/i18n.service.mock';

fdescribe('MitigationActionsNewComponent', () => {
  let component: MitigationActionsNewComponent;
  let fixture: ComponentFixture<MitigationActionsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        SharedModule,
      ],
      declarations: [
        MitigationActionsNewComponent,
        MitigationActionFormFlowComponent,
        ImpactFormComponent,
        EmissionsMitigationFormComponent,
        KeyAspectsFormComponent,
        BasicInformationFormComponent,
        InitiativeFormComponent,
      ],
      providers: [
        DatePipe,
        MockS3Service,
        {
          provide: MitigationActionsService,
          useClass: MockMitigationActionsService,
        },
        { provide: I18nService, useClass: MockI18nService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationActionsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
