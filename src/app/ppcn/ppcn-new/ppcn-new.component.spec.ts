import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PpcnNewComponent } from "./ppcn-new.component";
import { MaterialModule } from "@app/material.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CoreModule, I18nService } from "@app/core";
import { MockS3Service } from "@app/core/s3.service.mock";
import { PpcnService } from "../ppcn.service";
import { MockPpcnService } from "../ppcn.service.mock";
import { MockI18nService } from "@app/core/i18n.service.mock";
import { SharedModule } from "@app/shared";
import { GasReportTableComponent } from "../gas-report-table/gas-report-table.component";

describe("PpcnNewComponent", () => {
  let component: PpcnNewComponent;
  let fixture: ComponentFixture<PpcnNewComponent>;

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
        SharedModule,
      ],
      declarations: [PpcnNewComponent, GasReportTableComponent],
      providers: [
        MockS3Service,
        { provide: PpcnService, useClass: MockPpcnService },
        { provide: I18nService, useClass: MockI18nService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
