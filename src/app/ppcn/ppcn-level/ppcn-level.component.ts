import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	EventEmitter,
	Output,
	Input
} from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { finalize, tap } from "rxjs/operators";
import { environment } from "@env/environment";
import { Logger, I18nService, AuthenticationService } from "@app/core";

const log = new Logger("Report");

import { PpcnService } from "@app/ppcn/ppcn.service";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { TranslateService } from "@ngx-translate/core";
import { MatSnackBar } from "@angular/material";
import { PpcnFlowComponent } from "app/ppcn/ppcn-flow/ppcn-flow.component";
import { PpcnNewComponent } from "@app/ppcn/ppcn-new/ppcn-new.component";
import { GeographicLevel } from "../ppcn-new-form-data";

@Component({
	selector: "app-ppcn-level",
	templateUrl: "./ppcn-level.component.html",
	styleUrls: ["./ppcn-level.component.scss"]
})
export class PpcnLevelComponent implements OnInit {
	@Output() emitEvent: EventEmitter<number> = new EventEmitter<number>();

	version: string = environment.version;
	error: string;
	form: FormGroup;
	formData: FormData;
	levelId = "1";
	geographicLevel: Observable<GeographicLevel[]>;
	processedGeographicLevel: GeographicLevel[] = [];
	isLoading = false;

	@Input() level: string = "-1";

	constructor(
		private router: Router,
		private formBuilder: FormBuilder,
		private i18nService: I18nService,
		private service: PpcnService,
		private translateService: TranslateService,
		public snackBar: MatSnackBar
	) {
		this.formData = new FormData();
		this.createForm();
	}

	ngOnInit() {
		this.service.currentLevelId.subscribe(levelId => (this.levelId = levelId));
		console.log(this.level);
	}

	private createForm() {
		this.form = this.formBuilder.group({
			geographicCtrl: ["", Validators.required]
		});
		this.geographicLevel = this.initialFormData().pipe(
			tap((geographicLevel: GeographicLevel[]) => {
				this.processedGeographicLevel = geographicLevel;
			})
		);
	}

	private initialFormData(): Observable<GeographicLevel[]> {
		return this.service
			.geographicLevel(this.i18nService.language.split("-")[0])
			.pipe(
				finalize(() => {
					this.isLoading = false;
				})
			);
	}

	onSaving(context: any) {
		this.service.updateCurrentGeographicalLevel(context.value);
	}
}
