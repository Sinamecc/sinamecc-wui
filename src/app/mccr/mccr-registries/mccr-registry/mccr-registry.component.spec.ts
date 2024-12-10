import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from '@shared';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nService } from '@app/i18n/i18n.service';
import { MccrRegistriesService } from '../mccr-registries.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { S3Service } from '@shared/s3.service';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { MccrRegistryComponent } from './mccr-registry.component';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MccrRegistryComponent', () => {
  let component: MccrRegistryComponent;
  let fixture: ComponentFixture<MccrRegistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MccrRegistryComponent, LoaderComponent],
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
    fixture = TestBed.createComponent(MccrRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
