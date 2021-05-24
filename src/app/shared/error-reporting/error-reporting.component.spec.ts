import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from "@angular/router/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CoreModule } from "@app/core";
import { MaterialModule } from "@app/material.module";
import { ErrorReportingComponent } from "./error-reporting.component";

describe("ErrorReportingComponent", () => {
	let component: ErrorReportingComponent;
	let fixture: ComponentFixture<ErrorReportingComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ErrorReportingComponent],
			imports: [
				BrowserAnimationsModule,
				FlexLayoutModule,
				MaterialModule,
				RouterTestingModule,
				TranslateModule.forRoot(),
				ReactiveFormsModule,
				CoreModule
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ErrorReportingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	fit("should create", () => {
		expect(component).toBeTruthy();
	});
});
