import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReviewComponent } from './new-review.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core';
import { UpdateStatusComponent } from '@app/ppcn/update-status/update-status.component';
import { LoaderComponent } from '@shared';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { MockPpcnService } from '@app/ppcn/ppcn.service.mock';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { UpdateStatusService } from '@app/ppcn/update-status/update-status.service';
import { MockUpdateStatusService } from '@app/ppcn/update-status/update-status.service.mock';
import { I18nService } from '@app/i18n';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NewReviewComponent', () => {
  let component: NewReviewComponent;
  let fixture: ComponentFixture<NewReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewReviewComponent, UpdateStatusComponent, LoaderComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
      ],
      providers: [
        MockS3Service,
        { provide: PpcnService, useClass: MockPpcnService },
        { provide: I18nService, useClass: MockI18nService },
        { provide: UpdateStatusService, useClass: MockUpdateStatusService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
