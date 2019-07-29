import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { MccrRegistriesNewComponent } from '@app/mccr-registries/mccr-registries-new/mccr-registries-new.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoaderComponent, InputFileComponent } from '@app/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { MockTranslateService } from '@app/core/translate.service.mock';

import { I18nService } from '@app/core/i18n.service';
import { MockI18nService } from '@app/core/i18n.service.mock';
import { MccrRegistriesService } from '../mccr-registries.service';
import { AuthenticationService, MockAuthenticationService, CoreModule } from '@app/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { UploadProposalComponent } from '@app/shared/upload-proposal/upload-proposal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MockMccrRegistriesService } from '../mccr-registries.service.mock';
import { MockMitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service.mock';
import { MockS3Service } from '@app/core/s3.service.mock';

fdescribe('MccrRegistriesNewComponent', () => {
  let component: MccrRegistriesNewComponent;
  let fixture: ComponentFixture<MccrRegistriesNewComponent>;

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
        CoreModule
      ],      
      providers: [MockTranslateService, MockS3Service, DatePipe, MockMitigationActionsService, MockI18nService,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: I18nService, useClass: MockI18nService},
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: MitigationActionsService, useClass: MockMitigationActionsService},
        { provide: MccrRegistriesService, useClass: MockMccrRegistriesService },
        { provide: AuthenticationService, useClass: MockAuthenticationService }
        ],
        // { provide: I18nService, useClass: MockI18nService}],
      declarations: [ MccrRegistriesNewComponent, InputFileComponent, LoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrRegistriesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', inject([MockMitigationActionsService, MockI18nService, MockTranslateService], () => {
    expect(component).toBeTruthy();
  }));
});
