import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionsListComponent } from '@app/mitigation-actions/mitigation-actions-list/mitigation-actions-list.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MockMitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service.mock';
import { MockS3Service } from '@app/s3.service.mock';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { I18nService } from '@app/i18n/i18n.service';
import { CustomSearchBarComponent } from '@shared/custom-search-bar/custom-search-bar.component';
import { GenericButtonComponent } from '@shared/generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from '@shared/generic-button-secondary/generic-button-secondary.component';

describe('MitigationActionsListComponent', () => {
  let component: MitigationActionsListComponent;
  let fixture: ComponentFixture<MitigationActionsListComponent>;

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
        MitigationActionsListComponent,
        GenericButtonComponent,
        GenericButtonSecondaryComponent,
        CustomSearchBarComponent,
      ],
      providers: [
        I18nService,
        MockS3Service,
        { provide: MitigationActionsService, useClass: MockMitigationActionsService },
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: I18nService, useClass: MockI18nService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationActionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
