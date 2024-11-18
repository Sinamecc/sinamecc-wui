import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { Logger } from '@core';
import { environment } from '@env/environment';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { GeographicLevel } from '@app/ppcn/ppcn-new-form-data';
import { Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { TranslateService } from '@ngx-translate/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { finalize, tap } from 'rxjs/operators';

const log = new Logger('Report');

@Component({
  selector: 'app-ppcn-level',
  templateUrl: './ppcn-level.component.html',
  styleUrls: ['./ppcn-level.component.scss'],
})
export class PpcnLevelComponent implements OnInit {
  @Output() emitEvent: EventEmitter<number> = new EventEmitter<number>();

  version: string = environment.version;
  error: string;
  form: UntypedFormGroup;
  formData: FormData;
  levelId = '1';
  geographicLevel: Observable<GeographicLevel[]>;
  processedGeographicLevel: GeographicLevel[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private i18nService: I18nService,
    private service: PpcnService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar
  ) {
    this.formData = new FormData();
    this.createForm();
  }

  ngOnInit(): void {
    this.service.currentLevelId.subscribe((levelId) => (this.levelId = levelId));
  }

  private createForm() {
    this.form = this.formBuilder.group({
      geographicCtrl: ['', Validators.required],
    });
    this.geographicLevel = this.initialFormData().pipe(
      tap((geographicLevel: GeographicLevel[]) => {
        this.processedGeographicLevel = geographicLevel;
      })
    );
  }

  private initialFormData(): Observable<GeographicLevel[]> {
    return this.service.geographicLevel(this.i18nService.language.split('-')[0]).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  onSaving(context: any) {
    this.service.updateCurrentGeographicalLevel(context.value);
  }
}
