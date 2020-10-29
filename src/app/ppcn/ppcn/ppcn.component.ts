import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { PpcnService } from "@app/ppcn/ppcn.service";
import { Ppcn } from "@app/ppcn/ppcn_registry";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService, Credentials, I18nService } from "@app/core";
import { finalize } from "rxjs/operators";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { GenericDialogBoxComponent } from "../generic-dialog-box/generic-dialog-box.component";
import { groupBy } from "lodash";

@Component({
	selector: "app-ppcn",
	templateUrl: "./ppcn.component.html",
	styleUrls: ["./ppcn.component.scss"]
})
export class PpcnComponent implements OnInit {
	ppcn: Ppcn;
	isLoading: boolean;
	id: string;

	@Input() edit = false;
	showComments = false;
	userImage: string | SafeUrl = "assets/default_user_image.png";
	usernameComment = "";
	actualDate = new Date();

	modulesToComment = [
		{
			module: 1,
			fields: [
				"ID",
				"info.name",
				"general.legalCertificate",
				"specificLabel.representativeName",
				"general.legalRepresentativeCertificate",
				"info.phone",
				"general.confidential",
				"info.postalCode",
				"info.fax",
				"info.address"
			]
		},
		{
			module: 2,
			fields: [
				"info.contactName",
				"info.contactPosition",
				"info.contactPhone",
				"info.contactEmail"
			]
		},
		{
			module: 3,
			fields: [
				"geographyLabel.geographicLevel",
				"geographyLabel.requestLevel",
				"geographyLabel.recognitionType",
				"geographyLabel.classificationAmountEmissions",
				"geographyLabel.classificationNumberFacilities",
				"geographyLabel.ClassificationAmountInventoryData"
			]
		},
		{
			module: 4,
			fields: [
				"geographyLabel.reductionProyect",
				"geographyLabel.activityReduction",
				"geographyLabel.detailReduction",
				"geographyLabel.reducedEmissions",
				"geographyLabel.investmentReductions",
				"geographyLabel.totalInversion",
				"geographyLabel.totalReducedEmissions"
			]
		},
		{
			module: 5,
			fields: [
				"geographyLabel.compensationScheme",
				"geographyLabel.projectLocation",
				"geographyLabel.certificateNumber",
				"geographyLabel.totalCompensation",
				"geographyLabel.compensationCost",
				"geographyLabel.period"
			]
		},
		{
			module: 6,
			fields: [
				"OVV",
				"Emission Date",
				"specificLabel.reportYear",
				"specificLabel.baseYear"
			]
		},
		{
			module: 7,
			fields: [
				"ppcn.costInventoryRemovals",
				"ppcn.removalProjectDetail",
				"ppcn.totalRemovals"
			]
		}
	];

	comments: object[] = [];

	constructor(
		private router: Router,
		private i18nService: I18nService,
		private service: PpcnService,
		private authenticationService: AuthenticationService,
		private route: ActivatedRoute,
		private sanitizer: DomSanitizer
	) {
		this.id = this.route.snapshot.paramMap.get("id");
	}

	ngOnInit() {
		this.isLoading = true;
		this.service
			.getPpcn(this.id, this.i18nService.language.split("-")[0])
			.pipe(
				finalize(() => {
					this.isLoading = false;
				})
			)
			.subscribe((response: Ppcn) => {
				this.ppcn = response;
			});
		this.loadComments(this.id);
		this.getUserPhoto();
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
		a.remove();
		this.isLoading = false;
	}

	loadComments(id: string) {
		this.isLoading = true;
		this.service
			.getPpcnComments(id)
			.pipe(
				finalize(() => {
					this.isLoading = false;
				})
			)
			.subscribe((response: Object[]) => {
				if (response.length > 0) {
					this.comments = this.buildCommentsToShow(response);
					this.showComments = true;
				}
			});
	}

	buildCommentsToShow(comments: any[]) {
		const groups = groupBy(comments, comment => comment["form_section"]);
		const keys = Object.keys(groups);
		const modules = [];
		for (const key of keys) {
			const commentList = [];
			for (const comment of groups[key]) {
				const newComment = {
					fields: comment.field.split(","),
					comment: comment.comment
				};
				commentList.push(newComment);
			}
			const module = {
				module: key,
				comments: commentList
			};
			modules.push(module);
		}
		return modules;
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

	buildFormatComments(comments: any[]) {
		const commentList = [];
		for (const module of comments) {
			for (const comment of module.comments) {
				const newComment = {
					form_section: module.module,
					comment: comment.comment,
					field: comment.fields.toString()
				};
				commentList.push(newComment);
			}
		}

		return commentList;
	}
}
