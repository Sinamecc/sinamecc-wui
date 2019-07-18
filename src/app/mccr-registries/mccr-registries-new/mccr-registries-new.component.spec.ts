import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistriesNewComponent } from '@app/mccr-registries/mccr-registries-new/mccr-registries-new.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoaderComponent, InputFileComponent } from '@app/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nService } from '@app/core/i18n.service';
import { MccrRegistriesService } from '../mccr-registries.service';
import { AuthenticationService, MockAuthenticationService } from '@app/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { S3Service } from '@app/core/s3.service';
import { MockS3Service } from '@app/core/s3.service.mock';
import { UploadProposalComponent } from '@app/shared/upload-proposal/upload-proposal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MockTranslateService } from '@app/core/i18n.service.spec';
import { MockI18nService } from '@app/core/i18n.service.mock';

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
      ],      
      providers: [DatePipe, MccrRegistriesService, MitigationActionsService,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: S3Service, useClass: MockS3Service },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: I18nService, useClass: MockI18nService}],
      declarations: [ MccrRegistriesNewComponent, InputFileComponent, LoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrRegistriesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
