import {
	Component,
	OnInit,
	Input,
	OnChanges,
	SimpleChanges,
	Output,
	EventEmitter
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Logger, I18nService, AuthenticationService } from "@app/core";
import { MatSnackBar } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { finalize, tap } from "rxjs/operators";

const log = new Logger("UploadProposal");

import { UpdateStatusService } from "@app/shared/update-status/update-status.service";

@Component({
	selector: "app-update-status",
	templateUrl: "./update-status.component.html",
	styleUrls: ["./update-status.component.scss"]
})
export class UpdateStatusComponent implements OnInit {
	@Input() title: string;
	@Input() nextRoute: string;
	@Input() formSubmitRoute: string;
	@Input() entity: any;
	@Input() statusses: any;
	@Input() formData: FormData;
	@Input() shouldDisplayComment: boolean;
	@Output() formSubmitted = new EventEmitter<any>();

	error: string;
	form: FormGroup;
	isLoading = false;

	constructor(
		private router: Router,
		private i18nService: I18nService,
		public snackBar: MatSnackBar,
		private formBuilder: FormBuilder,
		private translateService: TranslateService,
		private service: UpdateStatusService
	) {}

	ngOnInit() {
		this.createForm();
	}

	private createForm() {
		this.form = this.formBuilder.group({
			statusCtrl: ["", Validators.required],
			descriptionCtrl: ["", null]
		});
	}

	submitForm() {
		this.isLoading = true;
		this.formSubmitted.emit(this.form.value);
		this.service
			.updateStatus(
				this.form.value,
				this.entity,
				this.formSubmitRoute,
				this.formData
			)
			.pipe(
				finalize(() => {
					this.form.markAsPristine();
					this.isLoading = false;
				})
			)
			.subscribe(
				(response: any) => {
					this.router.navigate([this.nextRoute], { replaceUrl: true });
					this.translateService
						.get("Sucessfully submitted form")
						.subscribe((res: string) => {
							this.snackBar.open(res, null, { duration: 3000 });
						});
					log.debug(`${response.statusCode} status code received from form`);
				},
				(error: any) => {
					log.debug(`Upload Proposal error: ${error}`);
					this.error = error;
				}
			);
	}

	compareIds(id1: any, id2: any): boolean {
		const a1 = determineId(id1);
		const a2 = determineId(id2);
		return a1 === a2;
	}
}

export function determineId(id: any): string {
	if (id.constructor.name === "array" && id.length > 0) {
		return "" + id[0];
	}
	return "" + id;
}
