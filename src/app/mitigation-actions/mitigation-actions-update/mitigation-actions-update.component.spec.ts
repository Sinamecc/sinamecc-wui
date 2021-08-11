import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionsUpdateComponent } from '@app/mitigation-actions/mitigation-actions-update/mitigation-actions-update.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core';
import { I18nService } from '@app/i18n';
import { MockS3Service } from '@app/s3.service.mock';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MockMitigationActionsService } from '../mitigation-actions.service.mock';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { MitigationActionFormFlowComponent } from '../mitigation-action-form-flow/mitigation-action-form-flow.component';
import { ImpactFormComponent } from '../impact-form/impact-form.component';
import { EmissionsMitigationFormComponent } from '../emissions-mitigation-form/emissions-mitigation-form.component';
import { KeyAspectsFormComponent } from '../key-aspects-form/key-aspects-form.component';
import { BasicInformationFormComponent } from '../basic-information-form/basic-information-form.component';
import { InitiativeFormComponent } from '../initiative-form/initiative-form.component';
import { GenericButtonComponent } from '@shared/generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from '@shared/generic-button-secondary/generic-button-secondary.component';

describe('MitigationActionsUpdateComponent', () => {
  let component: MitigationActionsUpdateComponent;
  let fixture: ComponentFixture<MitigationActionsUpdateComponent>;

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
      ],
      declarations: [
        MitigationActionsUpdateComponent,
        MitigationActionFormFlowComponent,
        ImpactFormComponent,
        EmissionsMitigationFormComponent,
        KeyAspectsFormComponent,
        BasicInformationFormComponent,
        InitiativeFormComponent,
        GenericButtonComponent,
        GenericButtonSecondaryComponent,
      ],
      providers: [
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
    fixture = TestBed.createComponent(MitigationActionsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
