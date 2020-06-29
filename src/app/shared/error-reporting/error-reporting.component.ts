import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "app-error-reporting",
	templateUrl: "./error-reporting.component.html",
	styleUrls: ["./error-reporting.component.scss"]
})
export class ErrorReportingComponent implements OnInit {
	constructor() {}

	generalError = "errorLabel.generalError";
	errorParse = [
		{ code: 504, description: "errorLabel.error504" },
		{ code: 404, description: "errorLabel.error-404" },
		{ code: 500, description: "errorLabel.error500" },
		{
			code: 401,
			description: "errorLabel.error401"
		},
		{ code: 400, description: "errorLabel.error400" }
	];

	errorToShow: string[] = [];
	showErrors = false;

	ngOnInit() {}

	parseErrors(errorList: any[]) {
		this.showErrors = true;
		this.errorToShow = [];
		for (const error of errorList) {
			const code = this.getCode(error.code);
			if (code) {
				if (code.code === 400) {
					this.errorToShow = this.errorToShow.concat(error.errors);
				} else {
					this.errorToShow.push(code.description);
				}
			} else {
				this.errorToShow.push(this.generalError);
				break;
			}
		}
	}

	getCode(code: number) {
		return this.errorParse.find(error => error.code === code);
	}
}
