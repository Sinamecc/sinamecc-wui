import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngeiHarmonizationComponent } from '@app/mitigation-actions/ingei-harmonization/ingei-harmonization.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DownloadProposalComponent } from '@app/shared/download-proposal/download-proposal.component';
import { I18nService } from '@app/core';
import { MockI18nService } from '@app/core/i18n.service.mock';
import { GenericButtonComponent } from '@app/shared/generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from '@app/shared/generic-button-secondary/generic-button-secondary.component';

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
        HttpClientTestingModule
      ],
      declarations: [ IngeiHarmonizationComponent, DownloadProposalComponent,GenericButtonComponent,
        GenericButtonSecondaryComponent ],
      providers: [ { provide: I18nService, useClass: MockI18nService } ]
    })
    .compileComponents();
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
