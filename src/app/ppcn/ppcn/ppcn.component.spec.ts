import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { PpcnComponent } from "./ppcn.component";
import { MaterialModule } from "@app/material.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LoaderComponent, SharedModule } from "@app/shared";
import { AuthenticationService, I18nService } from "@app/core";
import { MockI18nService } from "@app/core/i18n.service.mock";
import { PpcnService } from "../ppcn.service";
import { MockPpcnService } from "../ppcn.service.mock";
import { MockAuthenticationService } from "../../core/authentication/authentication.service.mock";
import { MockS3Service } from "@app/core/s3.service.mock";
import { CustomSearchBarComponent } from "@app/shared/custom-search-bar/custom-search-bar.component";
import { GenericButtonComponent } from "@app/shared/generic-button/generic-button.component";
import { GenericButtonSecondaryComponent } from "@app/shared/generic-button-secondary/generic-button-secondary.component";
import { GenericDialogBoxComponent } from "../generic-dialog-box/generic-dialog-box.component";

describe("PpcnComponent", () => {
	let component: PpcnComponent;
	let fixture: ComponentFixture<PpcnComponent>;

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
			declarations: [
				PpcnComponent,
				LoaderComponent,
				GenericButtonComponent,
				GenericButtonSecondaryComponent,
				CustomSearchBarComponent,
				GenericDialogBoxComponent
			],
			providers: [
				AuthenticationService,
				MockS3Service,
				{ provide: AuthenticationService, useClass: MockPpcnService },
				{ provide: PpcnService, useClass: MockPpcnService },
				{ provide: I18nService, useClass: MockI18nService }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PpcnComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
