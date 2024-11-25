import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionsUpdateComponent } from '@app/mitigation-actions/mitigation-actions-update/mitigation-actions-update.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MockMitigationActionsService } from '../mitigation-actions.service.mock';
import { MitigationActionFormFlowComponent } from '../mitigation-action-form-flow/mitigation-action-form-flow.component';
import { ImpactFormComponent } from '../impact-form/impact-form.component';
import { EmissionsMitigationFormComponent } from '../emissions-mitigation-form/emissions-mitigation-form.component';
import { KeyAspectsFormComponent } from '../key-aspects-form/key-aspects-form.component';
import { BasicInformationFormComponent } from '../basic-information-form/basic-information-form.component';
import { InitiativeFormComponent } from '../initiative-form/initiative-form.component';
import {
  ErrorReportingComponent,
  GenericButtonSecondaryComponent,
  GenericButtonComponent,
  MockS3Service,
} from '@shared';
import { I18nService } from '@app/i18n';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MitigationActionsUpdateComponent', () => {
  let component: MitigationActionsUpdateComponent;
  let fixture: ComponentFixture<MitigationActionsUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
        ErrorReportingComponent,
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
      ],
      providers: [
        MockS3Service,
        {
          provide: MitigationActionsService,
          useClass: MockMitigationActionsService,
        },
        { provide: I18nService, useClass: MockI18nService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationActionsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
