import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionReviewsNewComponent } from '@app/mitigation-actions/mitigation-action-reviews/mitigation-action-reviews-new/mitigation-action-reviews-new.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MockMitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service.mock';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { CoreModule } from '@core';
import { I18nService } from '@app/i18n';
import { UpdateStatusComponent, LoaderComponent, UpdateStatusService, MockUpdateStatusService } from '@shared';

describe('MitigationActionReviewsNewComponent', () => {
  let component: MitigationActionReviewsNewComponent;
  let fixture: ComponentFixture<MitigationActionReviewsNewComponent>;

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
        CoreModule,
      ],
      declarations: [MitigationActionReviewsNewComponent, UpdateStatusComponent, LoaderComponent],
      providers: [
        MockS3Service,
        { provide: I18nService, useClass: MockI18nService },
        {
          provide: MitigationActionsService,
          useClass: MockMitigationActionsService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        { provide: UpdateStatusService, useClass: MockUpdateStatusService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationActionReviewsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
