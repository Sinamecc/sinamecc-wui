import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistriesListComponent } from '@app/mccr/mccr-registries/mccr-registries-list/mccr-registries-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent, SharedModule } from '@app/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nService } from '@app/core/i18n.service';
import { MccrRegistriesService } from '../mccr-registries.service';
import { AuthenticationService, MockAuthenticationService } from '@app/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { S3Service } from '@app/core/s3.service';
import { MockS3Service } from '@app/core/s3.service.mock';
import { GenericButtonComponent } from '@app/shared/generic-button/generic-button.component';
import { CustomSearchBarComponent } from '@app/shared/custom-search-bar/custom-search-bar.component';
import { GenericButtonSecondaryComponent } from '@app/shared/generic-button-secondary/generic-button-secondary.component';


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
        HttpClientTestingModule,
      ],
      declarations: [
        MccrRegistriesListComponent,
        LoaderComponent,
        GenericButtonComponent,
        GenericButtonSecondaryComponent,
        CustomSearchBarComponent
       ],
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
