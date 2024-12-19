import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptualIntegrationNewComponent } from '@app/mitigation-actions/conceptual-integration-new/conceptual-integration-new.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoaderComponent, InputFileComponent, UploadProposalComponent, ByteFormatPipe, MockS3Service } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MockMitigationActionsService } from '../mitigation-actions.service.mock';
import { I18nService } from '@app/i18n';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ConceptualIntegrationNewComponent', () => {
  let component: ConceptualIntegrationNewComponent;
  let fixture: ComponentFixture<ConceptualIntegrationNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConceptualIntegrationNewComponent,
        UploadProposalComponent,
        LoaderComponent,
        InputFileComponent,
        ByteFormatPipe,
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
      ],
      providers: [
        MockS3Service,
        {
          provide: MitigationActionsService,
          useClass: MockMitigationActionsService,
        },
        { provide: I18nService, useClass: MockI18nService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptualIntegrationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
