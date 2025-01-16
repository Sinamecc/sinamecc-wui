import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionComponent } from '@app/mitigation-actions/mitigation-action/mitigation-action.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoaderComponent } from '@shared';
import { I18nService } from '@app/i18n';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MockMitigationActionsService } from '../mitigation-actions.service.mock';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MitigationActionComponent', () => {
  let component: MitigationActionComponent;
  let fixture: ComponentFixture<MitigationActionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MitigationActionComponent, LoaderComponent],
      imports: [MaterialModule, BrowserAnimationsModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        I18nService,
        MockS3Service,
        {
          provide: MitigationActionsService,
          useClass: MockMitigationActionsService,
        },
        { provide: I18nService, useClass: MockI18nService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
