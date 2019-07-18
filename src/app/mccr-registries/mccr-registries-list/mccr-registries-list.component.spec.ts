import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistriesListComponent } from '@app/mccr-registries/mccr-registries-list/mccr-registries-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from '@app/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nService } from '@app/core/i18n.service';
import { MccrRegistriesService } from '../mccr-registries.service';
import { AuthenticationService, MockAuthenticationService } from '@app/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { S3Service } from '@app/core/s3.service';
import { MockS3Service } from '@app/core/s3.service.mock';


describe('MccrRegistriesListComponent', () => {
  let component: MccrRegistriesListComponent;
  let fixture: ComponentFixture<MccrRegistriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [ MccrRegistriesListComponent, LoaderComponent ],
      providers: [I18nService, DatePipe, MccrRegistriesService, 
                  { provide: AuthenticationService, useClass: MockAuthenticationService },
                  { provide: S3Service, useClass: MockS3Service }]
                  
    })
    .compileComponents();
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
