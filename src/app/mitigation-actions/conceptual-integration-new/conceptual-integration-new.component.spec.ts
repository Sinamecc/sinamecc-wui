import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptualIntegrationNewComponent } from '@app/mitigation-actions/conceptual-integration-new/conceptual-integration-new.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UploadProposalComponent } from '@app/shared/upload-proposal/upload-proposal.component';
import { LoaderComponent, InputFileComponent } from '@app/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, I18nService } from '@app/core';
import { ByteFormatPipe } from '@app/shared/input-file/byte-format.pipe';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MockMitigationActionsService } from '../mitigation-actions.service.mock';
import { MockS3Service } from '@app/core/s3.service.mock';
import { MockI18nService } from '@app/core/i18n.service.mock';

describe('ConceptualIntegrationNewComponent', () => {
  let component: ConceptualIntegrationNewComponent;
  let fixture: ComponentFixture<ConceptualIntegrationNewComponent>;

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
        CoreModule
      ],
      declarations: [ ConceptualIntegrationNewComponent,
                      UploadProposalComponent,
                      LoaderComponent,
                      InputFileComponent,
                      ByteFormatPipe ],
      providers: [ MockS3Service,
        { provide: MitigationActionsService, useClass: MockMitigationActionsService},
        { provide: I18nService, useClass: MockI18nService}
      ]
    })
    .compileComponents();
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
