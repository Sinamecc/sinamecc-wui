import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVersionsComponent } from '@app/report/report-versions/report-versions.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoaderComponent } from '@app/shared/loader/loader.component';
import { I18nService, AuthenticationService, MockAuthenticationService } from '@app/core';
import { ReportService } from '../report.service';
import { MockReportService } from '../report.service.mock';

describe('ReportVersionsComponent', () => {
  let component: ReportVersionsComponent;
  let fixture: ComponentFixture<ReportVersionsComponent>;

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
      declarations: [ ReportVersionsComponent, LoaderComponent ],
      providers: [I18nService,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: ReportService, useClass: MockReportService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
