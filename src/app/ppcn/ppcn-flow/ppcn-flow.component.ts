import {
	Component,
	OnInit,
	ViewChild,
	EventEmitter,
	Output
} from "@angular/core";
import {
	FormBuilder,
	FormGroup,
	Validators,
	AbstractControl
} from "@angular/forms";
import { PpcnLevelComponent } from "app/ppcn/ppcn-level/ppcn-level.component";
import { PpcnNewComponent } from "app/ppcn/ppcn-new/ppcn-new.component";
import { PpcnService } from "@app/ppcn/ppcn.service";
import { DownloadProposalComponent } from "@app/shared/download-proposal/download-proposal.component";
import { PpcnUploadComponent } from "@app/ppcn/ppcn-upload/ppcn-upload.component";
import { Router } from "@angular/router";
import { I18nService } from "@app/core";
import { Ppcn } from "../ppcn_registry";

@Component({
	selector: "app-ppcn-flow",
	templateUrl: "./ppcn-flow.component.html",
	styleUrls: ["./ppcn-flow.component.scss"]
})
export class PpcnFlowComponent implements OnInit {
	@ViewChild("PpcnLevelComponent") geographicLvl: PpcnLevelComponent;
	@ViewChild("PpcnNewComponent") ppcnForm: PpcnNewComponent;
	@ViewChild("DownloadProposalComponent")
	downloadProposal: DownloadProposalComponent;
	@ViewChild("PpcnUploadComponent") uploadFiles: PpcnUploadComponent;

	mainGroup: FormGroup;

	get formArray(): AbstractControl | null {
		return this.mainGroup.get("formArray");
	}
	isLinear = true;
	formData: FormData;
	isLoading = false;
	generalFormData: FormData;
	levelId = "1";

	editLevel = "-1";

	editForm: boolean;
	idPpcnEdit: string;
	ppcnEdit: any;

	constructor(
		private _formBuilder: FormBuilder,
		private service: PpcnService,
		private router: Router,
		private i18nService: I18nService
	) {
		this.formData = new FormData();
		this.createForm();
	}

	ngOnInit() {
		this.service.currentLevelId.subscribe(
			(levelId: string) => (this.levelId = levelId)
		);

		this.editForm = this.router.url.includes("edit") ? true : false;
		if (this.editForm) {
			this.idPpcnEdit = this.router.url.split("/").splice(-1)[0];
			console.log(this.idPpcnEdit);

			this.getEditPpcn(this.idPpcnEdit);
		}
	}

	getEditPpcn(id: string) {
		this.service
			.getPpcn(id, this.i18nService.language.split("-")[0])
			.subscribe((response: Ppcn) => {
				this.editLevel = response.geographic_level.id.toString();
				this.ppcnEdit = response;
			});
	}

	createForm() {
		this.mainGroup = this._formBuilder.group({
			formArray: this._formBuilder.array([this.frmGeographic, this.frmPpcn])
		});
	}

	get frmGeographic() {
		return this.geographicLvl ? this.geographicLvl.form : null;
	}

	get frmPpcn() {
		return this.ppcnForm ? this.ppcnForm.formGroup : null;
	}

	get frmDownload() {
		return this.downloadProposal ? this.downloadProposal.fileName : null;
	}

	get frmUpload() {
		return this.uploadFiles ? this.uploadFiles.form : null;
	}
}
