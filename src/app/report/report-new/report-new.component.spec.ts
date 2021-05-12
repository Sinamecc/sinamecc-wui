import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReportNewComponent } from "@app/report/report-new/report-new.component";
import { MaterialModule } from "@app/material.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
	I18nService,
	AuthenticationService,
	MockAuthenticationService,
	CoreModule
} from "@app/core";
import { ReportService } from "../report.service";
import { MockReportService } from "../report.service.mock";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputFileComponent, LoaderComponent, SharedModule } from "@app/shared";
import { ByteFormatPipe } from "@app/shared/input-file/byte-format.pipe";
import { GenericButtonSecondaryComponent } from "@app/shared/generic-button-secondary/generic-button-secondary.component";
import { GenericButtonComponent } from "@app/shared/generic-button/generic-button.component";
import { ErrorReportingComponent } from "@app/shared/error-reporting/error-reporting.component";

describe("ReportNewComponent", () => {
	let component: ReportNewComponent;
	let fixture: ComponentFixture<ReportNewComponent>;

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
			declarations: [
				ReportNewComponent,
				InputFileComponent,
				LoaderComponent,
				ByteFormatPipe,
				GenericButtonComponent,
				GenericButtonSecondaryComponent,
				ErrorReportingComponent
			],
			providers: [
				I18nService,
				{ provide: AuthenticationService, useClass: MockAuthenticationService },
				{ provide: ReportService, useClass: MockReportService }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportNewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	fit("should create", () => {
		expect(component).toBeTruthy();
	});
});
