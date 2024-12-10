import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVersionsComponent } from '@app/report/report-versions/report-versions.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoaderComponent } from '@shared/loader/loader.component';
import { I18nService } from '@app/i18n/i18n.service';
import { ReportService } from '../report.service';
import { MockReportService } from '../report.service.mock';
import { GenericButtonComponent } from '@shared/generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from '@shared/generic-button-secondary/generic-button-secondary.component';
import { CustomSearchBarComponent } from '@shared/custom-search-bar/custom-search-bar.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ReportVersionsComponent', () => {
  let component: ReportVersionsComponent;
  let fixture: ComponentFixture<ReportVersionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportVersionsComponent,
        LoaderComponent,
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
      ],
      providers: [
        I18nService,
        { provide: ReportService, useClass: MockReportService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
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
