import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthenticationService } from "@app/core";
import { AdaptationAction } from "./interfaces/adaptationAction";
import { map } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import {
	ODS,
	SubTopics,
	TemporalityImpact,
	Topic
} from "./interfaces/catalogs";

const routes = {
	adaptationAction: () => `/v1/adaptation-action/`,
	adaptationActionUpdate: (id: string) => `/v1/adaptation-action/${id}/`,
	topics: () => `/v1/adaptation-action/get_topics/`,
	subTopics: () => `/v1/adaptation-action/get_subtopics/`,
	ods: () => `/v1/adaptation-action/get_ods/`,
	temporalityImpact: () => `/v1/adaptation-action/get_temporality_impact/`,
	generalImpact: () => `/v1/adaptation-action/get_general_impact/`
};

@Injectable()
export class AdaptationActionService {
	httpOptions = {
		headers: new HttpHeaders({
			Authorization: this.authenticationService.credentials.token
		})
	};

	private adaptationActionSource = new BehaviorSubject(null);
	currentAdaptationActionSource = this.adaptationActionSource.asObservable();

	updateCurrentAdaptationAction(newAdaptationAction: AdaptationAction) {
		this.adaptationActionSource.next(newAdaptationAction);
	}

	constructor(
		private authenticationService: AuthenticationService,
		private httpClient: HttpClient
	) {}

	public createNewAdaptationAction(payload: AdaptationAction) {
		return this.httpClient
			.post(routes.adaptationAction(), payload, this.httpOptions)
			.pipe(
				map((body: any) => {
					this.updateCurrentAdaptationAction(body);
					const response = {
						statusCode: 200,
						message: "Form submitted correctly",
						body: body
					};
					return response;
				})
			);
	}

	public updateNewAdaptationAction(payload: AdaptationAction, id: string) {
		return this.httpClient
			.put(routes.adaptationActionUpdate(id), payload, this.httpOptions)
			.pipe(
				map((body: any) => {
					this.updateCurrentAdaptationAction(body);
					const response = {
						statusCode: 200,
						message: "Form submitted correctly",
						body: body
					};
					return response;
				})
			);
	}

	public loadAdaptationActions() {
		return this.httpClient
			.get(routes.adaptationAction(), this.httpOptions)
			.pipe(
				map((body: AdaptationAction[]) => {
					return body;
				})
			);
	}

	public loadTopics() {
		return this.httpClient.get(routes.topics(), this.httpOptions).pipe(
			map((body: Topic[]) => {
				return body;
			})
		);
	}

	public loadSubTopics() {
		return this.httpClient.get(routes.subTopics(), this.httpOptions).pipe(
			map((body: SubTopics[]) => {
				return body;
			})
		);
	}

	public loadODS() {
		return this.httpClient.get(routes.ods(), this.httpOptions).pipe(
			map((body: ODS[]) => {
				return body;
			})
		);
	}

	public loadTemporalityImpact() {
		return this.httpClient
			.get(routes.temporalityImpact(), this.httpOptions)
			.pipe(
				map((body: TemporalityImpact[]) => {
					return body;
				})
			);
	}

	public loadGeneralImpact() {
		return this.httpClient.get(routes.generalImpact(), this.httpOptions).pipe(
			map((body: TemporalityImpact[]) => {
				return body;
			})
		);
	}
}
