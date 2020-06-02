import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { MitigationActionReview } from "./mitigation-action-review";
import { MitigationAction } from "./mitigation-action";
import { Response } from "./mitigation-actions.service";
import { MitigationActionNewFormData } from "./mitigation-action-new-form-data";
import * as _moment from "moment";
import { MitigationActionReviewNewFormData } from "./mitigation-action-review-new-form-data";
import { StatusRoutesMap } from "@app/shared/status-routes-map";
import { HttpErrorResponse } from "@angular/common/http";
import { S3File } from "@app/core/s3.service";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { MockS3Service } from "@app/core/s3.service.mock";
import { Inject } from "@angular/core";
const moment = _moment;
export class MockMitigationActionsService {
	currentMitigationAction: Observable<MitigationAction>;

	public someMitigationActions: MitigationAction[];
	s3: MockS3Service;

	constructor(@Inject(MockS3Service) s3: MockS3Service) {
		this.someMitigationActions = [
			{
				initiative: {
					budget: Math.random(),
					contact: {
						id: "1",
						full_name: "Random Guy Falkes",
						email: "randomeemail@me.com",
						job_title: "Manager",
						phone: "22401070"
					},
					description: "Some desc",
					entity_responsible: "Some entity",
					finance: {
						id: Math.random().toString(36).substring(30),
						status: {
							id: Math.random().toString(36).substring(30),
							name: "Status 1"
						},
						finance_source_type: {
							id: Math.random().toString(36).substring(30),
							name: "Finance Source Type of Initiative"
						},
						source: "Some clear source"
					},
					goal: "Some goal",
					id: Math.random().toString(36).substring(30),
					initiative_type: {
						id: Math.random().toString(36).substring(30),
						initiative_type: "Some type of initiative"
					},
					objective: "Some objective",
					status: {
						id: Math.random().toString(36).substring(30),
						status: "Approved"
					},
					name: "A good initiative"
				},
				name: "This is a mitigation action",
				id: "1",
				strategy_name: "Some Test Strategy",
				purpose: "Some Test Purpose",
				finance: {
					id: Math.random().toString(36).substring(5),
					status: {
						id: Math.random().toString(36).substring(5),
						name: "Approved"
					},
					finance_source_type: {
						id: "09",
						name: "Approved"
					},
					source: "loan"
				},
				quantitative_purpose: "Some Test Quantitative Purpose",
				status: {
					id: Math.random().toString(36).substring(5),
					status: "Approved"
				},
				gas_inventory: "90000",
				geographic_scale: {
					id: +Math.random().toString(36).substring(5),
					name: "National"
				},
				start_date: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				end_date: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				institution: {
					id: Math.random().toString(36).substring(5),
					name: "MINAE"
				},
				question_ucc: "Some test UCC question",
				question_ovv: "Some test OVV question",
				contact: {
					id: Math.random().toString(36).substring(5),
					full_name: "Randall Valenciano",
					email: "rvalenciano@minae.co.cr",
					job_title: "Industrial Engineer",
					phone: "+50687453311"
				},
				emissions_source: "Cars, Industry, Home Appliances",
				carbon_sinks: "Some carbon sinks",
				impact: "Some impact",
				impact_plan: "Some Impact Plan",
				calculation_methodology: "Some Calculation Methdodology",
				is_international: false,
				international_participation: "No",
				sustainability: "Some sustainability measure",
				location: {
					id: Math.random().toString(36).substring(5),
					geographical_site: "Pacayas",
					is_gis_annexed: "Yes"
				},
				progress_indicator: {
					id: Math.random().toString(36).substring(5),
					name: "CO2 tons per million of people",
					type: "quantitative",
					unit: "Tons",
					start_date: moment(
						new Date(+new Date() - Math.floor(Math.random() * 10000000000))
					).format("MM/DD/YYYY")
				},
				next_state: {
					states: ["dcc-approval"],
					required_comments: false
				},
				created: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				updated: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				fsm_state: "created",
				files: [
					{ name: "test 1", file: Math.random().toString(36) },
					{ name: "test 2", file: Math.random().toString(36) },
					{ name: "test 3", file: Math.random().toString(36) }
				]
			},
			{
				initiative: {
					budget: Math.random(),
					contact: {
						id: "2",
						full_name: "Random Guy Falkes",
						email: "randomeemail@me.com",
						job_title: "Manager",
						phone: "22401070"
					},
					description: "Some desc",
					entity_responsible: "Some entity",
					finance: {
						id: Math.random().toString(36).substring(30),
						status: {
							id: Math.random().toString(36).substring(30),
							name: "Status 1"
						},
						finance_source_type: {
							id: Math.random().toString(36).substring(30),
							name: "Finance Source Type of Initiative"
						},
						source: "Some clear source"
					},
					goal: "Some goal",
					id: Math.random().toString(36).substring(30),
					initiative_type: {
						id: Math.random().toString(36).substring(30),
						initiative_type: "Some type of initiative"
					},
					objective: "Some objective",
					status: {
						id: Math.random().toString(36).substring(30),
						status: "Approved"
					},
					name: "A good initiative"
				},
				name: "This is a mitigation action 2",
				id: Math.random().toString(36).substring(30),
				strategy_name: "Some Test Strategy",
				purpose: "Some Test Purpose",
				finance: {
					id: Math.random().toString(36).substring(5),
					status: {
						id: Math.random().toString(36).substring(5),
						name: "Approved"
					},
					finance_source_type: {
						id: "09",
						name: "Approved"
					},
					source: "loan"
				},
				quantitative_purpose: "Some Test Quantitative Purpose",
				status: {
					id: Math.random().toString(36).substring(5),
					status: "Approved"
				},
				gas_inventory: "90000",
				geographic_scale: {
					id: +Math.random().toString(36).substring(5),
					name: "National"
				},
				start_date: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				end_date: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				institution: {
					id: Math.random().toString(36).substring(5),
					name: "MINAE"
				},
				question_ucc: "Some test UCC question",
				question_ovv: "Some test OVV question",
				contact: {
					id: Math.random().toString(36).substring(5),
					full_name: "Randall Valenciano",
					email: "rvalenciano@minae.co.cr",
					job_title: "Industrial Engineer",
					phone: "+50687453311"
				},
				emissions_source: "Cars, Industry, Home Appliances",
				carbon_sinks: "Some carbon sinks",
				impact: "Some impact",
				impact_plan: "Some Impact Plan",
				calculation_methodology: "Some Calculation Methdodology",
				is_international: false,
				international_participation: "No",
				sustainability: "Some sustainability measure",
				location: {
					id: Math.random().toString(36).substring(5),
					geographical_site: "Pacayas",
					is_gis_annexed: "Yes"
				},
				progress_indicator: {
					id: Math.random().toString(36).substring(5),
					name: "CO2 tons per million of people",
					type: "quantitative",
					unit: "Tons",
					start_date: moment(
						new Date(+new Date() - Math.floor(Math.random() * 10000000000))
					).format("MM/DD/YYYY")
				},
				next_state: {
					states: ["dcc-approval"],
					required_comments: false
				},
				created: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				updated: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				fsm_state: "created",
				files: [
					{ name: "test 1", file: Math.random().toString(36) },
					{ name: "test 2", file: Math.random().toString(36) },
					{ name: "test 3", file: Math.random().toString(36) }
				]
			},
			{
				initiative: {
					budget: Math.random(),
					contact: {
						id: Math.random().toString(36).substring(30),
						full_name: "Random Guy Falkes",
						email: "randomeemail@me.com",
						job_title: "Manager",
						phone: "22401070"
					},
					description: "Some desc",
					entity_responsible: "Some entity",
					finance: {
						id: Math.random().toString(36).substring(30),
						status: {
							id: Math.random().toString(36).substring(30),
							name: "Status 1"
						},
						finance_source_type: {
							id: Math.random().toString(36).substring(30),
							name: "Finance Source Type of Initiative"
						},
						source: "Some clear source"
					},
					goal: "Some goal",
					id: Math.random().toString(36).substring(30),
					initiative_type: {
						id: Math.random().toString(36).substring(30),
						initiative_type: "Some type of initiative"
					},
					objective: "Some objective",
					status: {
						id: Math.random().toString(36).substring(30),
						status: "Approved"
					},
					name: "A good initiative"
				},
				name: "This is a mitigation action 3",
				id: "3",
				strategy_name: "Some Test Strategy",
				purpose: "Some Test Purpose",
				finance: {
					id: Math.random().toString(36).substring(5),
					status: {
						id: Math.random().toString(36).substring(5),
						name: "Approved"
					},
					finance_source_type: {
						id: "09",
						name: "Approved"
					},
					source: "loan"
				},
				quantitative_purpose: "Some Test Quantitative Purpose",
				status: {
					id: Math.random().toString(36).substring(5),
					status: "Approved"
				},
				gas_inventory: "90000",
				geographic_scale: {
					id: +Math.random().toString(36).substring(5),
					name: "National"
				},
				start_date: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				end_date: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				institution: {
					id: Math.random().toString(36).substring(5),
					name: "MINAE"
				},
				question_ucc: "Some test UCC question",
				question_ovv: "Some test OVV question",
				contact: {
					id: Math.random().toString(36).substring(5),
					full_name: "Randall Valenciano",
					email: "rvalenciano@minae.co.cr",
					job_title: "Industrial Engineer",
					phone: "+50687453311"
				},
				emissions_source: "Cars, Industry, Home Appliances",
				carbon_sinks: "Some carbon sinks",
				impact: "Some impact",
				impact_plan: "Some Impact Plan",
				calculation_methodology: "Some Calculation Methdodology",
				is_international: false,
				international_participation: "No",
				sustainability: "Some sustainability measure",
				location: {
					id: Math.random().toString(36).substring(5),
					geographical_site: "Pacayas",
					is_gis_annexed: "Yes"
				},
				progress_indicator: {
					id: Math.random().toString(36).substring(5),
					name: "CO2 tons per million of people",
					type: "quantitative",
					unit: "Tons",
					start_date: moment(
						new Date(+new Date() - Math.floor(Math.random() * 10000000000))
					).format("MM/DD/YYYY")
				},
				next_state: {
					states: ["dcc-approval"],
					required_comments: false
				},
				created: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				updated: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				fsm_state: "created",
				files: [
					{ name: "test 1", file: Math.random().toString(36) },
					{ name: "test 2", file: Math.random().toString(36) },
					{ name: "test 3", file: Math.random().toString(36) }
				]
			}
		];
		this.s3 = s3;
		this.currentMitigationAction = of(this.someMitigationActions[0]);
	}
	updateCurrentMitigationAction(newMitigationAction: MitigationAction) {
		return this.someMitigationActions[0];
	}

	submitMitigationActionNewForm(context: any): Observable<Response> {
		return of({
			statusCode: 200,
			message: "Mitigation Action Created",
			id: "001"
		});
	}

	submitMitigationActionUpdateForm(
		context: any,
		uuid: string,
		lang: string
	): Observable<Response> {
		return of({
			statusCode: 200,
			message: "Mitigation Action Updated",
			id: "001"
		});
	}

	newMitigationActionFormData(
		language: string,
		registration_type: string
	): Observable<MitigationActionNewFormData> {
		const newFormData: MitigationActionNewFormData = {
			registration_types: [
				{
					id: Math.random().toString(36).substring(5),
					type: "Some type 1"
				},
				{
					id: Math.random().toString(36).substring(5),
					type: "Some type 2"
				}
			],
			initiative_types: [
				{ id: +Math.random().toString(36).substring(5), types: "Private" },
				{ id: +Math.random().toString(36).substring(5), types: "Public" }
			],
			institutions: [
				{ id: +Math.random().toString(36).substring(5), name: "MINAE" },
				{ id: +Math.random().toString(36).substring(5), name: "DINADECO" },
				{ id: +Math.random().toString(36).substring(5), name: "DCC" }
			],
			statuses: [
				{
					id: +Math.random().toString(36).substring(5),
					status: "DCC approved"
				},
				{ id: +Math.random().toString(36).substring(5), status: "DCC rejected" }
			],
			finances: [
				{
					id: +Math.random().toString(36).substring(5),
					name: "Loan 31313",
					source: "IMF"
				},
				{
					id: +Math.random().toString(36).substring(5),
					name: "Loan 31314",
					source: "WEF"
				}
			],
			ingei_compliances: [
				{
					id: +Math.random().toString(36).substring(5),
					name: "Ingei Compliance #1"
				},
				{
					id: +Math.random().toString(36).substring(5),
					name: "Ingei Compliance #2"
				}
			],
			geographic_scales: [
				{ id: +Math.random().toString(36).substring(5), name: "Local" },
				{ id: +Math.random().toString(36).substring(5), name: "Regional" }
			],
			finance_source_types: [
				{ id: +Math.random().toString(36).substring(5), name: "Local" },
				{ id: +Math.random().toString(36).substring(5), name: "International" }
			],
			finance_status: [
				{
					id: +Math.random().toString(36).substring(5),
					status: "To be approved"
				},
				{ id: +Math.random().toString(36).substring(5), status: "Approved" }
			]
		};
		return of(newFormData);
	}

	mitigationActions(language: string): Observable<MitigationAction[]> {
		return of(this.someMitigationActions);
	}

	mitigationActionReviews(uuid: string): Observable<MitigationActionReview[]> {
		return of([
			{
				date: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				previous_status: "Submitted",
				current_status: "In Review by DCC"
			},
			{
				date: moment(
					new Date(+new Date() - Math.floor(Math.random() * 10000000000))
				).format("MM/DD/YYYY"),
				previous_status: "In Review by DCC",
				current_status: "Approved by DCC"
			}
		]);
	}

	getMitigationAction(
		uuid: string,
		lang: string
	): Observable<MitigationAction> {
		return of(this.someMitigationActions.find(ma => ma.id === uuid));
	}

	deleteMitigationAction(uuid: string): Observable<{} | Object> {
		return of({
			statusCode: 200,
			message: "Mitigation Action Deleted",
			id: "001"
		});
	}

	getMitigationActionReviewStatuses(): Observable<
		MitigationActionReviewNewFormData
	> {
		return of({
			statuses: [
				{ status: "Submitted" },
				{ status: "Approved by DCC" },
				{ status: "Rejected by DCC" }
			]
		});
	}

	submitNewMitigationActionReviewForm(context: any, uuid: string) {
		return {
			statusCode: 200,
			message: "Form submitted correctly"
		};
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
