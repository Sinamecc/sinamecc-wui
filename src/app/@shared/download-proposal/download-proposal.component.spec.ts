import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DownloadProposalComponent } from '@shared/download-proposal/download-proposal.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nService } from '@app/i18n';
import { GenericButtonSecondaryComponent } from '../generic-button-secondary/generic-button-secondary.component';
import { GenericButtonComponent } from '../generic-button/generic-button.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DownloadProposalComponent', () => {
  let component: DownloadProposalComponent;
  let fixture: ComponentFixture<DownloadProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadProposalComponent, GenericButtonComponent, GenericButtonSecondaryComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [I18nService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
