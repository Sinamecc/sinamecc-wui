import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsListComponent } from './reviews-list.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { MockPpcnService } from '@app/ppcn/ppcn.service.mock';
import { I18nService } from '@app/i18n';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { SharedModule } from '@shared';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ReviewsListComponent', () => {
  let component: ReviewsListComponent;
  let fixture: ComponentFixture<ReviewsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewsListComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
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
    fixture = TestBed.createComponent(ReviewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
