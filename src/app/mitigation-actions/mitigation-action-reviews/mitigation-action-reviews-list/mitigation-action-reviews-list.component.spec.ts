import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionReviewsListComponent } from '@app/mitigation-actions/mitigation-action-reviews/mitigation-action-reviews-list/mitigation-action-reviews-list.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MockMitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service.mock';
import { MockS3Service } from '@shared/s3.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MitigationActionsReviewsListComponent', () => {
  let component: MitigationActionReviewsListComponent;
  let fixture: ComponentFixture<MitigationActionReviewsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MitigationActionReviewsListComponent],
      imports: [MaterialModule, BrowserAnimationsModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        MockS3Service,
        {
          provide: MitigationActionsService,
          useClass: MockMitigationActionsService,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationActionReviewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
