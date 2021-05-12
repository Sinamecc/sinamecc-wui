import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from "@angular/router/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CoreModule } from "@app/core";
import { SharedModule } from "@app/shared";
import { MaterialModule } from "@app/material.module";
import { RestorePasswordComponent } from "./restore-password.component";
import { MatCardModule } from "@angular/material";

describe("RestorePasswordComponent", () => {
	let component: RestorePasswordComponent;
	let fixture: ComponentFixture<RestorePasswordComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RestorePasswordComponent],
			imports: [
				BrowserAnimationsModule,
				FlexLayoutModule,
				MaterialModule,
				SharedModule,
				RouterTestingModule,
				TranslateModule.forRoot(),
				ReactiveFormsModule,
				CoreModule,
				MatCardModule
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RestorePasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	fit("should create", () => {
		expect(component).toBeTruthy();
	});
});
