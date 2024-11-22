import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OvvProposalComponent } from '@app/mccr/mccr-registries/ovv-proposal/ovv-proposal.component';
import { MaterialModule } from '@app/material.module';
import { DownloadProposalComponent } from '@shared/download-proposal/download-proposal.component';
import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { S3Service } from '@shared/s3.service';
import { GenericButtonComponent } from '@shared/generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from '@shared/generic-button-secondary/generic-button-secondary.component';
import { CustomSearchBarComponent } from '@shared/custom-search-bar/custom-search-bar.component';
import { I18nService } from '@app/i18n';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OvvProposalComponent', () => {
  let component: OvvProposalComponent;
  let fixture: ComponentFixture<OvvProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OvvProposalComponent,
        DownloadProposalComponent,
        GenericButtonComponent,
        GenericButtonSecondaryComponent,
        CustomSearchBarComponent,
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        I18nService,
        DatePipe,
        MccrRegistriesService,
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: S3Service, useClass: MockS3Service },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvvProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
