import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportComponent } from '@app/report/report.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { I18nService } from '@app/core/i18n.service';
import { AuthenticationService, MockAuthenticationService } from '@app/core';
import { ReportService } from './report.service';
import { MockReportService } from './report.service.mock';
import { GenericButtonComponent } from '@app/shared/generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from '@app/shared/generic-button-secondary/generic-button-secondary.component';
import { CustomSearchBarComponent } from '@app/shared/custom-search-bar/custom-search-bar.component';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

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
      declarations: [ ReportComponent,GenericButtonComponent,GenericButtonSecondaryComponent,CustomSearchBarComponent],
      providers: [I18nService,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: ReportService, useClass: MockReportService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
