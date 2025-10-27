import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Logger, untilDestroyed } from '@core';
import { environment } from '@env/environment';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { GeographicLevel } from '@app/ppcn/ppcn-new-form-data';
import { I18nService } from '@app/i18n';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { finalize, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

const log = new Logger('Report');

@Component({
  selector: 'app-ppcn-level',
  templateUrl: './ppcn-level.component.html',
  styleUrls: ['./ppcn-level.component.scss'],
  standalone: false,
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
    private formBuilder: UntypedFormBuilder,
    private i18nService: I18nService,
    private service: PpcnService,
    public snackBar: MatSnackBar,
  ) {
    this.formData = new FormData();
    this.createForm();
  }

  ngOnInit(): void {
    this.service.currentLevelId.pipe(untilDestroyed(this)).subscribe((levelId) => (this.levelId = levelId));
  }

  ngOnDestroy() {}

  private createForm() {
    this.form = this.formBuilder.group({
      geographicCtrl: ['', Validators.required],
    });
    this.geographicLevel = this.initialFormData().pipe(
      tap((geographicLevel: GeographicLevel[]) => {
        this.processedGeographicLevel = geographicLevel;
      }),
    );
  }

  private initialFormData(): Observable<GeographicLevel[]> {
    return this.service.geographicLevel(this.i18nService.language.split('-')[0]).pipe(
      finalize(() => {
        this.isLoading = false;
      }),
    );
  }

  onSaving(context: any) {
    this.service.updateCurrentGeographicalLevel(context.value);
  }
}
