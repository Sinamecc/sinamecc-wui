import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from '@shared';
import { RouterTestingModule } from '@angular/router/testing';
import { MockTranslateService } from '@app/i18n/translate.service.mock';
import { I18nService } from '@app/i18n/i18n.service';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { MccrRegistriesService } from '../mccr-registries.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MockMitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service.mock';
import { MockS3Service } from '@app/s3.service.mock';
import { MockMccrRegistriesService } from '@app/mccr-registries/mccr-registries.service.mock';
import { MccrRegistriesNewComponent } from './mccr-registries-new.component';
import { GenericButtonComponent } from '@shared/generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from '@shared/generic-button-secondary/generic-button-secondary.component';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { CoreModule } from '@core';
import { InputFileComponent } from '@shared/input-file/input-file.component';
import { DatePipe } from '@angular/common';
import { S3Service } from '@app/s3.service';

describe('MccrRegistriesNewComponent', () => {
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
        CoreModule,
      ],
      providers: [
        MockMccrRegistriesService,
        MockI18nService,
        MockMitigationActionsService,
        MockS3Service,
        MockTranslateService,
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: MccrRegistriesService, useClass: MockMccrRegistriesService },
        { provide: MitigationActionsService, useClass: MockMitigationActionsService },
        { provide: I18nService, useClass: MockI18nService },
        { provide: S3Service, useClass: MockS3Service },
        DatePipe,
      ],
      // { provide: I18nService, useClass: MockI18nService}],
      declarations: [
        MccrRegistriesNewComponent,
        InputFileComponent,
        LoaderComponent,
        GenericButtonComponent,
        GenericButtonSecondaryComponent,
      ],
    }).compileComponents();
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
