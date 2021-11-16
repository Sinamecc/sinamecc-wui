import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '@shared/loader/loader.component';
import { MockMitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service.mock';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { MccrRegistriesService } from '../mccr-registries.service';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { MockTranslateService } from '@app/i18n/translate.service.mock';
import { MccrRegistriesUpdateComponent } from './mccr-registries-update.component';
import { MockMccrRegistriesService } from '@app/mccr-registries/mccr-registries.service.mock';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { I18nService } from '@app/i18n';

describe('MccrRegistriesUpdateComponent', () => {
  let component: MccrRegistriesUpdateComponent;
  let fixture: ComponentFixture<MccrRegistriesUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [MccrRegistriesUpdateComponent, LoaderComponent],
      providers: [
        MockMccrRegistriesService,
        MockMitigationActionsService,
        MockS3Service,
        MockTranslateService,
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: MccrRegistriesService, useClass: MockMccrRegistriesService },
        {
          provide: MitigationActionsService,
          useClass: MockMitigationActionsService,
        },
        { provide: I18nService, useClass: MockI18nService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrRegistriesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
