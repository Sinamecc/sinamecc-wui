import { Component, OnInit, ElementRef, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { finalize } from "rxjs/operators";

import {
	Logger,
	I18nService,
	AuthenticationService,
	Credentials
} from "@app/core";

const log = new Logger("Report");

import { MitigationActionsService } from "@app/mitigation-actions/mitigation-actions.service";
import { MitigationAction } from "@app/mitigation-actions/mitigation-action";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
	selector: "app-mitigation-action",
	templateUrl: "./mitigation-action.component.html",
	styleUrls: ["./mitigation-action.component.scss"]
})
export class MitigationActionComponent implements OnInit {
	mitigationAction: MitigationAction;
	isLoading: boolean;
	id: string;
	@Input() edit = false;
	userImage: string | SafeUrl = "assets/default_user_image.png";
	usernameComment = "";
	actualDate = new Date();
	addComment = false;
	showComments = false;
	commentSchema = [
		{
			module: "specificLabel.initiative",
			subModules: [
				{
					name: "specificLabel.initiative",
					fields: [
						"specificLabel.initiativeType",
						"specificLabel.initiativeName",
						"specificLabel.initiativeDescription",
						"specificLabel.initiativeGoal"
					]
				},
				{
					name: "specificLabel.initiativeContactInfo",
					fields: [
						"mitigationAction.entityReporting",
						"info.contactName",
						"general.position",
						"info.emailAddress",
						"info.emailAddress"
					]
				},
				{
					name: "mitigationAction.statusMitigationAction",
					fields: [
						"mitigationAction.initiativeStatus",
						"mitigationAction.startImplementation",
						"mitigationAction.deploymentCompletion",
						"general.other",
						"mitigationAction.entitiesInvolvedMitigationActionCtrl",
						"mitigationAction.entitiesInvolvedMitigationActionCtrl"
					]
				},
				{
					name: "general.GeographicLocation",
					fields: ["general.geographicScale", "general.locationAction"]
				},
				{
					name: "mitigationAction.CategorizationNationalInstruments",
					fields: [
						"mitigationAction.relationshipNDC",
						"mitigationAction.relationshipDecarbonizationPlan",
						"mitigationAction.impactCategory",
						"mitigationAction.relationshipNDC"
					]
				}
			]
		},
		{
			module: "info.financingInformation",
			subModules: [
				{
					name: "info.financingInformation",
					fields: [
						"mitigationAction.financingStatus",
						"mitigationAction.stepsTakingToFinancing",
						"mitigationAction.detailfinancingSource",
						"mitigationAction.financingSourceApplying",
						"mitigationAction.mitigationActionBudget",
						"mitigationAction.referenceYear"
					]
				},
				{
					name: "mitigationAction.financedSourcesInternationalCooperation",
					fields: [
						"mitigationAction.registeredNonReimbursableCooperationMideplan",
						"mitigationAction.nameRegisteredMideplan",
						"mitigationAction.entityProject"
					]
				}
			]
		},
		{
			module: "general.keyAspects",
			subModules: [
				{
					name: "mitigationAction.overviewImpactEmissionsRemovals",
					fields: [
						"mitigationAction.overviewImpactEmissionsRemovals",
						"mitigationAction.graphicLogicImpactEmissionsRemovals",
						"mitigationAction.sectorsGEIInventoryImpacted",
						"mitigationAction.preliminaryIdentificationSustainableDevelopmentGoals"
					]
				}
			]
		},
		{
			module: "specificLabel.mitigationEmissions",
			subModules: [
				{
					name: "specificLabel.documentationImpactEstimate",
					fields: [
						"specificLabel.exAnteEmissionReductions",
						"mitigationAction.periodPotentialEmissionReductionEstimated",
						"mitigationAction.sourcesEmissionsGasesCovered",
						"mitigationAction.carbonSinksReservoirs",
						"mitigationAction.definitionBaseline",
						"mitigationAction.methodologyExantePotentialReductionEmissionsCO2",
						"mitigationAction.documentationCalculationsEstimateReductionEmissionsCO2",
						"mitigationAction.isCurrentlyReflectedInventory"
					]
				},
				{
					name: "mitigationAction.QA/QCEestimate",
					fields: [
						"mitigationAction.standardizedCalculationMethodologyUsed",
						"mitigationAction.calculationsDocumented",
						"mitigationAction.emissionFactorsUsedCalculationDocumented",
						"mitigationAction.assumptionsDocumented"
					]
				}
			]
		},
		{
			module: "specificLabel.informationMonitoring",
			subModules: [
				{
					name: "specificLabel.monitoringDetail",
					fields: [
						"mitigationAction.indicatorName",
						"mitigationAction.indicatorDescription",
						"mitigationAction.indicatorUnit",
						"mitigationAction.methodologicalDetailIndicator",
						"mitigationAction.indicatorReportingPeriodicity",
						"mitigationAction.timeSeriesAvailable",
						"general.until",
						"mitigationAction.geographicCoverage",
						"general.other",
						"mitigationAction.disintegration",
						"mitigationAction.dataSource",
						"mitigationAction.howSustainabilityIndicator",
						"mitigationAction.sinameccClassifiers",
						"mitigationAction.observationsComments",
						"mitigationAction.additionalInformation"
					]
				},
				{
					name: "mitigationAction.indicatorDataSource",
					fields: [
						"mitigationAction.responsibleInstitution",
						"mitigationAction.sourceType",
						"general.other",
						"mitigationAction.statisticalOperationName"
					]
				},
				{
					name: "mitigationAction.thematicCategorization",
					fields: [
						"mitigationAction.datatype",
						"general.other",
						"mitigationAction.SINAMECCClassifiers",
						"general.other"
					]
				},
				{
					name: "mitigationAction.contactInformation",
					fields: [
						"mitigationAction.namePersonResponsible",
						"reportData.institution",
						"mitigationAction.contactPersonTitle",
						"info.emailAddress",
						"info.phone"
					]
				},
				{
					name: "mitigationAction.changeLog",
					fields: [
						"mitigationAction.dateLastUpdate",
						"mitigationAction.changesLastupdate",
						"mitigationAction.descriptionChanges",
						"mitigationAction.authorLastUpdate"
					]
				}
			]
		},
		{
			module: "mitigationAction.monitoringReportingClimateActions",
			subModules: [
				{
					name: "mitigationAction.monitoringProgressLog",
					fields: [
						"mitigationAction.anyProgressMonitoringRecordedClimateActions"
					]
				},
				{
					name: "mitigationAction.indicatorMonitoring",
					fields: [
						"mitigationAction.indicatorSelection",
						"mitigationAction.reportingPeriod",
						"general.until",
						"mitigationAction.indicatorDataUpdateDate",
						"mitigationAction.sourceType"
					]
				},
				{
					name: "mitigationAction.generalProgressReportClimateAction",
					fields: ["mitigationAction.beenProgressActionPeriod"]
				}
			]
		}
	];

	comments: any[] = [];

	constructor(
		private router: Router,
		private i18nService: I18nService,
		private service: MitigationActionsService,
		private route: ActivatedRoute,
		private authenticationService: AuthenticationService,
		private sanitizer: DomSanitizer
	) {
		this.id = this.route.snapshot.paramMap.get("id");
	}

	comment(
		module: string,
		subModule: string,
		fields: string[],
		comment: string
	) {
		const newComment = {
			module: module,
			subModule: subModule,
			fields: fields,
			comment: comment
		};

		this.comments.push(newComment);
	}

	findQuestion(id: string) {
		if (this.mitigationAction) {
			if (this.mitigationAction.impact_documentation.question) {
				return this.mitigationAction.impact_documentation.question.find(
					(x: { code: string }) => x.code === id
				).detail;
			}
		}
		return "";
	}

	ngOnInit() {
		this.isLoading = true;
		this.service
			.getMitigationAction(this.id, this.i18nService.language.split("-")[0])
			.pipe(
				finalize(() => {
					this.isLoading = false;
				})
			)
			.subscribe((response: MitigationAction) => {
				this.mitigationAction = response;
				if (!this.edit) {
					this.getComments(response.id);
				}
			});

		if (this.edit) {
			this.getUserPhoto();
		}
	}

	getComments(id: string) {
		this.service.getComments(id).subscribe(response => {
			this.buildCommentsToShow(response);
			this.showComments = response.length > 0 ? true : false;
		});
	}

	buildCommentsToShow(comments: any) {
		for (const comment of comments) {
			const modules = comment.form_section.split(",");
			const newComment = {
				module: modules[0],
				subModule: modules[1],
				fields: comment.field.split(","),
				comment: comment.comment
			};
			this.comments.push(newComment);
		}
	}

	getCurrentPhoto(photoList: any[]) {
		for (const photo of photoList) {
			if (photo.current) {
				return photo;
			}
		}
		return undefined;
	}

	get credential(): Credentials {
		return this.authenticationService.credentials;
	}

	getUserPhoto() {
		this.usernameComment = this.credential.fullName;
		const userPhoto = this.getCurrentPhoto(this.credential.userPhoto);
		if (userPhoto) {
			this.authenticationService
				.getUserPhoto(userPhoto.image)
				.subscribe((image: any) => {
					this.userImage = this.sanitizer.bypassSecurityTrustUrl(
						this.createImageFromBlob(image)
					);
				});
		}
	}

	createImageFromBlob(image: Blob) {
		return URL.createObjectURL(image);
	}

	review(uuid: string) {
		this.router.navigate([`mitigation/actions/${uuid}/reviews`], {
			replaceUrl: true
		});
	}

	async download(file: string) {
		this.isLoading = true;
		const blob = await this.service.downloadResource(file);
		const url = window.URL.createObjectURL(blob.data);
		const a = document.createElement("a");
		document.body.appendChild(a);
		a.setAttribute("style", "display: none");
		a.href = url;
		a.download = blob.filename;
		a.click();
		window.URL.revokeObjectURL(url);
		a.remove(); // remove the element
		this.isLoading = false;
	}

	isValidComment(
		module: string,
		subModule: string,
		fields: string[],
		comment: string
	) {
		return (
			module !== "" && subModule !== "" && comment !== "" && fields.length > 0
		);
	}

	buildFormatComments(comments: any[]) {
		const formatComments = [];

		for (const comment of comments) {
			const tempComment = {
				form_section: `${comment.module},${comment.subModule}`,
				field: comment.fields.toString(),
				comment: comment.comment
			};
			formatComments.push(tempComment);
		}

		return formatComments;
	}
}
