import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnDownloadComponent } from './ppcn-download.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DownloadProposalComponent } from '@shared/download-proposal/download-proposal.component';
import { PpcnService } from '../ppcn.service';
import { MockPpcnService } from '../ppcn.service.mock';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { I18nService } from '@app/i18n';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { GenericButtonComponent } from '@shared/generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from '@shared/generic-button-secondary/generic-button-secondary.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PpcnDownloadComponent', () => {
  let component: PpcnDownloadComponent;
  let fixture: ComponentFixture<PpcnDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PpcnDownloadComponent,
        DownloadProposalComponent,
        GenericButtonComponent,
        GenericButtonSecondaryComponent,
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        MockS3Service,
        { provide: PpcnService, useClass: MockPpcnService },
        { provide: I18nService, useClass: MockI18nService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
