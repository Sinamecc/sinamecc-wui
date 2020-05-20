import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnListComponent } from './ppcn-list.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockS3Service } from '@app/core/s3.service.mock';
import { PpcnService } from '../ppcn.service';
import { MockPpcnService } from '../ppcn.service.mock';
import { I18nService, AuthenticationService, MockAuthenticationService } from '@app/core';
import { MockI18nService } from '@app/core/i18n.service.mock';
import { CustomSearchBarComponent } from '@app/shared/custom-search-bar/custom-search-bar.component';
import { GenericButtonComponent } from '@app/shared/generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from '@app/shared/generic-button-secondary/generic-button-secondary.component';

describe('PpcnListComponent', () => {
  let component: PpcnListComponent;
  let fixture: ComponentFixture<PpcnListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [
        PpcnListComponent,
        GenericButtonComponent,
        GenericButtonSecondaryComponent,
        CustomSearchBarComponent ],
      providers: [
        MockS3Service,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: PpcnService, useClass: MockPpcnService },
        { provide: I18nService, useClass: MockI18nService}
      ]
    })
    .compileComponents();
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
