import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnFlowComponent } from './ppcn-flow.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PpcnLevelComponent } from '../ppcn-level/ppcn-level.component';
import { PpcnNewComponent } from '../ppcn-new/ppcn-new.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreModule, I18nService } from '@app/core';
import { MockS3Service } from '@app/core/s3.service.mock';
import { PpcnService } from '../ppcn.service';
import { MockPpcnService } from '../ppcn.service.mock';
import { MockI18nService } from '@app/core/i18n.service.mock';
import { SharedModule } from '@app/shared';

describe('PpcnFlowComponent', () => {
  let component: PpcnFlowComponent;
  let fixture: ComponentFixture<PpcnFlowComponent>;

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
        SharedModule
      ],
      declarations: [ PpcnFlowComponent,
                      PpcnLevelComponent,
                      PpcnNewComponent
                    ],
      providers: [
        MockS3Service,
        { provide: PpcnService, useClass: MockPpcnService },
        { provide: I18nService, useClass: MockI18nService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
