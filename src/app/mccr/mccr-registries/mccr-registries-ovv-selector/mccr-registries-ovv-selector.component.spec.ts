import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistriesOvvSelectorComponent } from './mccr-registries-ovv-selector.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from '@shared';
import { RouterTestingModule } from '@angular/router/testing';
import { MccrRegistriesService } from '../mccr-registries.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MockMitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service.mock';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { MockMccrRegistriesService } from '@app/mccr-registries/mccr-registries.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MccrRegistriesOvvSelectorComponent', () => {
  let component: MccrRegistriesOvvSelectorComponent;
  let fixture: ComponentFixture<MccrRegistriesOvvSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MccrRegistriesOvvSelectorComponent, LoaderComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        MockMccrRegistriesService,
        MockMitigationActionsService,
        MockS3Service,
        { provide: MccrRegistriesService, useClass: MockMccrRegistriesService },
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
    fixture = TestBed.createComponent(MccrRegistriesOvvSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have ovvs after ngOnInit', () => {
    component.ngOnInit();
    expect(component.ovvs).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
