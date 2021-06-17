import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { Logger, I18nService, AuthenticationService } from "@app/core";
import { MitigationAction } from "@app/mitigation-actions/mitigation-action";
import { MitigationActionReview } from "@app/mitigation-actions/mitigation-action-review";
import { MitigationActionNewFormData } from "@app/mitigation-actions/mitigation-action-new-form-data";
import { DatePipe } from "@angular/common";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { MitigationActionReviewNewFormData } from "@app/mitigation-actions/mitigation-action-review-new-form-data";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { StatusRoutesMap } from "@app/shared/status-routes-map";
import { S3File, S3Service } from "@app/core/s3.service";

const routes = {
	seededFormData: (lang: string, registration_type: string) =>
		`/v1/mitigations/form/${lang}/${registration_type}`,
	submitNewMitigationAction: (id: string = "") => `/v1/mitigation-action/${id}`,
	submitUpdateMitigationAction: (uuid: string, lang: string) =>
		`/v1/mitigations/${lang}/${uuid}`,
	mitigationActions: (lang: string) => `/v1/mitigation-action/`,
	mitigationActionReviews: (uuid: string) =>
		`/v1/mitigations/changelog/${uuid}`,
	deleteMitigationAction: (uuid: string) => `/v1/mitigation-action/${uuid}`,
	getMitigationAction: (uuid: string, lang: string) =>
		`/v1/mitigation-action/${uuid}/`,
	mitigationActionAvailableStatuses: () => `/v1/workflow/status`,
	submitMitigationActionReview: (uuid: string) => `/v1/mitigations/${uuid}`,
	submitNewHarmonizationForMitigation: () =>
		`/v1/mitigations/harmonization/ingei/`,
	getIndicator: (code: string) => `/api/v1/mitigation-action/${code}/indicator/`
};

export interface Response {
	// Customize received credentials here
	statusCode: number;
	message: string;
	id?: string;
}

export interface ReportContext {
	comment: string;
	file: string | any;
}

@Injectable()
export class MitigationActionsService {
	constructor(
		private authenticationService: AuthenticationService,
		private httpClient: HttpClient,
		private datePipe: DatePipe,
		private s3: S3Service
	) {}

	private mitigationActionSource = new BehaviorSubject(null);
	currentMitigationAction = this.mitigationActionSource.asObservable();

	updateCurrentMitigationAction(newMitigationAction: MitigationAction) {
		this.mitigationActionSource.next(newMitigationAction);
	}

	submitMitigationActionNewForm(context: any): Observable<Response> {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: this.authenticationService.credentials.token
			})
		};
		return this.httpClient
			.post(routes.submitNewMitigationAction(), context, httpOptions)
			.pipe(
				map((body: any) => {
					this.updateCurrentMitigationAction(body);
					const response = {
						statusCode: 200,
						message: "Form submitted correctly"
					};
					return response;
				})
			);
	}

	submitMitigationActionUpdateForm(
		context: any,
		uuid: string
	): Observable<Response> {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: this.authenticationService.credentials.token
			})
		};
		return this.httpClient
			.put(routes.submitNewMitigationAction(uuid + "/"), context, httpOptions)
			.pipe(
				map((body: any) => {
					this.updateCurrentMitigationAction(body);
					const response = {
						statusCode: 200,
						id: body.id,
						message: "Form submitted correctly"
					};
					return response;
				})
			);
	}

	newMitigationActionFormData(
		language: string,
		registration_type: string
	): Observable<MitigationActionNewFormData> {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: this.authenticationService.credentials.token
			})
		};
		return this.httpClient
			.get(routes.seededFormData(language, registration_type), httpOptions)
			.pipe(
				map((body: any) => {
					return body;
				})
			);
	}

	getMitigationActionIndicators(id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: this.authenticationService.credentials.token
			})
		};
		return this.httpClient.get(routes.getIndicator(id), httpOptions).pipe(
			map((body: any) => {
				return body;
			})
		);
	}

	mitigationActions(language: string): Observable<MitigationAction[]> {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: this.authenticationService.credentials.token
			})
		};
		return this.httpClient
			.get(routes.mitigationActions(language), httpOptions)
			.pipe(
				map((body: any) => {
					return body;
				})
			);
	}

	mitigationActionReviews(uuid: string): Observable<MitigationActionReview[]> {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: this.authenticationService.credentials.token
			})
		};

		return this.httpClient
			.get(routes.mitigationActionReviews(uuid), httpOptions)
			.pipe(
				map((body: any) => {
					return body;
				})
			);
	}

	getMitigationAction(
		uuid: string,
		lang: string
	): Observable<MitigationAction> {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: this.authenticationService.credentials.token
			})
		};
		return this.httpClient
			.get(routes.getMitigationAction(uuid, lang), httpOptions)
			.pipe(
				map((body: any) => {
					return body;
				})
			);
	}

	deleteMitigationAction(uuid: string): Observable<{} | Object> {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: this.authenticationService.credentials.token
			})
		};
		const url = routes.deleteMitigationAction(uuid);
		// routes.deleteMitigationAction(uuid)
		return this.httpClient.delete(url, httpOptions).pipe(
			map((body: any) => {
				const response = {
					statusCode: 200,
					message: "Mitigation Action deleted correctly"
				};
				return response;
			})
		);
	}

	getMitigationActionReviewStatuses(): Observable<
		MitigationActionReviewNewFormData
	> {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: this.authenticationService.credentials.token
			})
		};
		return this.httpClient
			.get(routes.mitigationActionAvailableStatuses(), httpOptions)
			.pipe(
				map((body: any) => {
					return body;
				})
			);
	}

	submitNewMitigationActionReviewForm(context: any, uuid: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: this.authenticationService.credentials.token
			})
		};

		context["user"] = this.authenticationService.credentials.id;
		const url = routes.submitMitigationActionReview(uuid);
		return this.httpClient.patch(url, context, httpOptions).pipe(
			map((body: any) => {
				const response = {
					statusCode: 200,
					message: "Form submitted correctly"
				};
				return response;
			})
		);
	}

	mapRoutesStatuses(uuid: string): StatusRoutesMap[] {
		return [
			{
				route: `mitigation/actions/${uuid}/edit`,
				status: "changes_requested_by_DCC"
			},
			{
				route: `mitigation/actions/${uuid}/harmonization/integration`,
				status: "updating_INGEI_changes_proposal"
			},
			{
				route: `mitigation/actions/${uuid}/harmonization/integration`,
				status: "updating_INGEI_changes_proposal_by_request_of_DCC_IMN"
			},
			{
				route: `mitigation/actions/${uuid}/conceptual/integration`,
				status: "implementing_INGEI_changes"
			}
			// implementing_INGEI_changes
		];
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error("An error occurred:", error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
				`Backend returned code ${error.status}, ` + `body was: ${error.error}`
			);
		}
		// return an ErrorObservable with a user-facing error message
		return new ErrorObservable(
			"Something bad happened; please try again later."
		);
	}

	public async downloadResource(filePath: string): Promise<S3File> {
		return this.s3.downloadResource(filePath);
	}
}
