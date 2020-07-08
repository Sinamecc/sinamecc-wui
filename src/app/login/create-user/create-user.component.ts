import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { environment } from "@env/environment";
import { I18nService } from "@app/core/i18n.service";

@Component({
	selector: "app-create-user",
	templateUrl: "./create-user.component.html",
	styleUrls: ["./create-user.component.scss"]
})
export class CreateUserComponent implements OnInit {
	version: string = environment.version;
	error: string;
	loginForm: FormGroup;
	isLoading = false;
	constructor(private i18nService: I18nService) {}

	ngOnInit() {}

	get currentLanguage(): string {
		return this.i18nService.language;
	}

	get languages(): string[] {
		return this.i18nService.supportedLanguages;
	}
}
