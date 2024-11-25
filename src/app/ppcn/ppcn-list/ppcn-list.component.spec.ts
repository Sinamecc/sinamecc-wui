import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnListComponent } from './ppcn-list.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { PpcnService } from '../ppcn.service';
import { MockPpcnService } from '../ppcn.service.mock';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { CustomSearchBarComponent } from '@shared/custom-search-bar/custom-search-bar.component';
import { GenericButtonComponent } from '@shared/generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from '@shared/generic-button-secondary/generic-button-secondary.component';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { I18nService } from '@app/i18n';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PpcnListComponent', () => {
  let component: PpcnListComponent;
  let fixture: ComponentFixture<PpcnListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PpcnListComponent,
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
        MockS3Service,
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: PpcnService, useClass: MockPpcnService },
        { provide: I18nService, useClass: MockI18nService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
