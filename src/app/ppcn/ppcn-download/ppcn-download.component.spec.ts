import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnDownloadComponent } from './ppcn-download.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DownloadProposalComponent } from '@app/shared/download-proposal/download-proposal.component';
import { PpcnService } from '../ppcn.service';
import { MockPpcnService } from '../ppcn.service.mock';
import { MockS3Service } from '@app/core/s3.service.mock';
import { I18nService } from '@app/core';
import { MockI18nService } from '@app/core/i18n.service.mock';

describe('PpcnDownloadComponent', () => {
  let component: PpcnDownloadComponent;
  let fixture: ComponentFixture<PpcnDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [ PpcnDownloadComponent, DownloadProposalComponent ],
      providers: [
        MockS3Service,
        { provide: PpcnService, useClass: MockPpcnService },
        { provide: I18nService, useClass: MockI18nService}
      ]
    })
    .compileComponents();
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
