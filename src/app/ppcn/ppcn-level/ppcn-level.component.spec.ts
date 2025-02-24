import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnLevelComponent } from '@app/ppcn/ppcn-level/ppcn-level.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { PpcnService } from '../ppcn.service';
import { MockPpcnService } from '../ppcn.service.mock';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { CoreModule } from '@core';
import { I18nService } from '@app/i18n';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PpcnLevelComponent', () => {
  let component: PpcnLevelComponent;
  let fixture: ComponentFixture<PpcnLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PpcnLevelComponent],
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
