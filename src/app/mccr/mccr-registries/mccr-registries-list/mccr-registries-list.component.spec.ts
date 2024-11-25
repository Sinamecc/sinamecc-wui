import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistriesListComponent } from '@app/mccr/mccr-registries/mccr-registries-list/mccr-registries-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MccrRegistriesService } from '../mccr-registries.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { S3Service } from '@shared/s3.service';
import { MockS3Service } from '@shared/s3.service.mock';
import { GenericButtonComponent } from '@shared/generic-button/generic-button.component';
import { CustomSearchBarComponent } from '@shared/custom-search-bar/custom-search-bar.component';
import { GenericButtonSecondaryComponent } from '@shared/generic-button-secondary/generic-button-secondary.component';
import { LoaderComponent } from '@shared';
import { I18nService } from '@app/i18n';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MccrRegistriesListComponent', () => {
  let component: MccrRegistriesListComponent;
  let fixture: ComponentFixture<MccrRegistriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MccrRegistriesListComponent,
        LoaderComponent,
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
        I18nService,
        DatePipe,
        MccrRegistriesService,
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: S3Service, useClass: MockS3Service },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrRegistriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
