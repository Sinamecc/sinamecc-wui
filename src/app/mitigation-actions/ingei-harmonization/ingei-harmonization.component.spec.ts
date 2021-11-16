import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngeiHarmonizationComponent } from '@app/mitigation-actions/ingei-harmonization/ingei-harmonization.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GenericButtonComponent, DownloadProposalComponent, GenericButtonSecondaryComponent } from '@shared';
import { I18nService } from '@app/i18n';
import { MockI18nService } from '@app/i18n/i18n.service.mock';

describe('IngeiHarmonizationComponent', () => {
  let component: IngeiHarmonizationComponent;
  let fixture: ComponentFixture<IngeiHarmonizationComponent>;

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
        IngeiHarmonizationComponent,
        DownloadProposalComponent,
        GenericButtonComponent,
        GenericButtonSecondaryComponent,
      ],
      providers: [{ provide: I18nService, useClass: MockI18nService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngeiHarmonizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
