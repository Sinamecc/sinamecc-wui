import { Component, OnInit } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { environment } from "@env/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { I18nService, Logger } from "@app/core";
import { TranslateService } from "@ngx-translate/core";
import { MatSnackBar } from "@angular/material";
import { Ppcn } from "@app/ppcn/ppcn_registry";
import { Observable } from "rxjs/Observable";
import { PpcnService } from "@app/ppcn/ppcn.service";
import { tap, finalize } from "rxjs/operators";
const log = new Logger("Report");

@Component({
	selector: "app-ppcn-upload",
	templateUrl: "./ppcn-upload.component.html",
	styleUrls: ["./ppcn-upload.component.scss"]
})
export class PpcnUploadComponent implements OnInit {
	version: string = environment.version;
	error: string;
	form: FormGroup;
	isLoading = false;
	files: FormArray;
	ppcns: Observable<Ppcn[]>;
	processedPpcns: Ppcn[] = [];
	id: number;

	ppcn: Ppcn;

	fileDetail = [
		{
			name: "Persona jurídica",
			description:
				"En caso de persona jurídica, copia de certificación de personería jurídica vigente emitida por el Registro Nacional y copia de cédula del representante legal."
		},
		{
			name: "Persona física",
			description:
				"En caso de persona física, fotocopia de la cédula de identidad del responsable de la organización."
		},
		{
			name: "Cuotas obrero patronales de la CCSS",
			description:
				"Certificado de que se encuentra al día con las cuotas obrero patronales de la CCSS.(Se acepta la consulta en línea, pero su fecha de emisión tiene que ser del día que presentan los documentos)"
		},
		{
			name: "Permiso sanitario de funcionamiento (PSF)",
			description:
				"Copia del Permiso sanitario de funcionamiento (PSF) del Ministerio de Salud o del Certificado veterinario de operación (CVO) del Ministerio de Agricultura y Ganadería de las instalaciones"
		},
		{
			name: "Obligaciones municipales",
			description:
				"Certificación de que se encuentra al día con las obligaciones municipales (pago de impuestos municipales al día). (Se acepta la consulta en línea donde indique que está al día, no se acepta facturas de pago)"
		},
		{
			name: "Procesos condenatorios abiertos",
			description:
				"Declaración jurada firmada por el representante legal de la organización, donde indique que la organización no posee procesos condenatorios abiertos por causas ambientales y que cumpla con todas las leyes y reglamentos aplicables del país. La declaración debe incluir el compromiso de informar a la DCC inmediatamente si la organización deja de estar en cumplimiento de la legislación del país."
		},
		{
			name: "Informe de GEI",
			description:
				"Informe de GEI que respalda la declaración de GEI que la organización presenta ante el OVV, que incluya el inventario de GEI y las instalaciones de la organización incluidas dentro del inventario (indicando los detalles de organigramas y/o edificios, plantas de producción, así como las fuentes de emisión asociadas a estas instalaciones). (Si durante el proceso de verificación la organización modifica el Informe o los datos del inventario de GEI, debe presentar la versión actualizada del Informe que incluya las modificaciones solicitadas por el OVV)"
		},
		{
			name: "Plan de gestión de GEI",
			description:
				"Plan de gestión de GEI con acciones de reducción, dónde se indiquen las metas, indicadores de seguimiento, responsables, objetivos, etc."
		},
		{
			name: "Informe de verificación emitido por el OVV",
			description:
				"Informe de verificación emitido por el OVV y, en caso de que existan hallazgos que afecten los datos que respalden la declaración, se debe presentar la evidencia de los datos finales de emisiones, reducciones, remociones y compensaciones; deberá venir con firma del OVV (esta información debe reportarse por medio del informe de GEI)."
		},
		{
			name: "Copia de documento de Declaración de verificación de GEI",
			description:
				"Copia de documento de Declaración de verificación de GEI emitido por el OVV acreditado, deberá venir con firma del OVV."
		},
		{
			name: "Remociones propias",
			description:
				"En el caso de que la organización tenga remociones propias, se debe de adjuntar la certificación del registro en donde se haga referencia al propietario del proyecto."
		},
		{
			name: "Logotipo de la Organización.",
			description:
				"Adjuntar el Logotipo de la Organización. Esto para que sea colocado en la web de la DCC, en las organizaciones que forman parte del Programa País."
		}
	];

	constructor(
		private router: Router,
		private formBuilder: FormBuilder,
		private i18nService: I18nService,
		private translateService: TranslateService,
		private ppcnService: PpcnService,
		public snackBar: MatSnackBar,
		private route: ActivatedRoute
	) {
		this.createForm();
	}

	ngOnInit() {
		this.id = parseInt(this.route.snapshot.paramMap.get("id"));
	}

	submitForm() {
		this.isLoading = true;
		this.ppcnService
			.submitPpcnNewFile(this.form.value)
			.pipe(
				finalize(() => {
					this.form.markAsPristine();
					this.isLoading = false;
				})
			)
			.subscribe(
				response => {
					this.router.navigate(["/ppcn/registries"], { replaceUrl: true });
					this.translateService
						.get("Sucessfully submitted file")
						.subscribe((res: string) => {
							this.snackBar.open(res, null, { duration: 3000 });
						});
					log.debug(`${response.statusCode} status code received from form`);
				},
				error => {
					log.debug(`PPCN File error: ${error}`);
					this.error = error;
				}
			);
	}

	private createForm() {
		this.ppcns = this.initialFormData().pipe(
			tap((ppcns: Ppcn[]) => {
				this.processedPpcns = ppcns;

				this.ppcn = this.processedPpcns.find(
					ppcnToFind => parseInt(ppcnToFind.id) === this.id
				);
				this.form = this.formBuilder.group({
					ppcnCtrl: [this.ppcn.id, Validators.required],
					files: this.formBuilder.array([
						this.createItem(),
						this.createItem(),
						this.createItem(),
						this.createItem(),
						this.createItem(),
						this.createItem(),
						this.createItem(),
						this.createItem(),
						this.createItem(),
						this.createItem(),
						this.createItem(),
						this.createItem()
					])
				});
			})
		);
	}

	private createItem(): FormGroup {
		return this.formBuilder.group({
			file: [{ value: undefined, disabled: false }, []]
		});
	}
	private addFile(): void {
		const control = <FormArray>this.form.controls["files"];
		control.push(this.createItem());
	}

	private removeFile(i: number) {
		const control = <FormArray>this.form.controls["files"];
		control.removeAt(i);
	}

	private initialFormData(): Observable<Ppcn[]> {
		return this.ppcnService.ppcn(this.i18nService.language.split("-")[0]).pipe(
			finalize(() => {
				this.isLoading = false;
			})
		);
	}
}
