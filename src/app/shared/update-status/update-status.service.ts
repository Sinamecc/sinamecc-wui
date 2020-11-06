import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { AuthenticationService } from "@app/core";
import { map, catchError } from "rxjs/operators";

export interface Response {
	// Customize received credentials here
	statusCode: number;
	message: string;
	id?: string;
}
@Injectable()
export class UpdateStatusService {
	constructor(
		private authenticationService: AuthenticationService,
		private httpClient: HttpClient
	) {}

	updateStatus(
		context: any,
		entity: any,
		routeToUpload: string,
		formData: FormData
	): Observable<Response> {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: this.authenticationService.credentials.token
			})
		};

		const form = {
			fsm_state: context.context.statusCtrl,
			comments: context.comments
		};

		// let formData = entity.buildProposalData(context);
		return this.httpClient.patch(routeToUpload, form, httpOptions).pipe(
			map((body: any) => {
				const response = {
					statusCode: 200,
					message: "Form submitted correctly"
				};
				return response;
			})
		);
	}
}
