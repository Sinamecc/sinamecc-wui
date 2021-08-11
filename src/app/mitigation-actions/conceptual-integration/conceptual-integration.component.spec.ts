import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptualIntegrationComponent } from '@app/mitigation-actions/conceptual-integration/conceptual-integration.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core';
import { DownloadProposalComponent } from '@shared/download-proposal/download-proposal.component';
import { GenericButtonComponent } from '@shared/generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from '@shared/generic-button-secondary/generic-button-secondary.component';

describe('ConceptualIntegrationComponent', () => {
  let component: ConceptualIntegrationComponent;
  let fixture: ComponentFixture<ConceptualIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
      ],
      declarations: [
        ConceptualIntegrationComponent,
        DownloadProposalComponent,
        GenericButtonComponent,
        GenericButtonSecondaryComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptualIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
