import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnFlowComponent } from './ppcn-flow.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PpcnLevelComponent } from '../ppcn-level/ppcn-level.component';
import { PpcnNewComponent } from '../ppcn-new/ppcn-new.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { PpcnService } from '../ppcn.service';
import { MockPpcnService } from '../ppcn.service.mock';
import { SharedModule } from '@shared';
import { GasReportTableComponent } from '../gas-report-table/gas-report-table.component';
import { CoreModule } from '@core';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { I18nService } from '@app/i18n';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PpcnFlowComponent', () => {
  let component: PpcnFlowComponent;
  let fixture: ComponentFixture<PpcnFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PpcnFlowComponent, PpcnLevelComponent, PpcnNewComponent, GasReportTableComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        SharedModule,
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
    fixture = TestBed.createComponent(PpcnFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
