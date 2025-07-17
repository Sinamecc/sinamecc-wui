import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger } from '@core';
import { Observable } from 'rxjs';
import { AdaptationAction } from '../interfaces/adaptationAction';
import { AdaptationActionService } from '../adaptation-actions-service';

const log = new Logger('Report');

@Component({
  selector: 'app-adaptation-action-update',
  templateUrl: './adaptation-action-update.component.html',
  styleUrls: ['./adaptation-action-update.component.scss'],
  standalone: false,
})
export class AdaptationActionUpdateComponent implements OnInit {
  version: string = environment.version;
  error: string;
  formGroup: UntypedFormGroup;
  isLoading = false;
  isNonLinear = false;
  initalRequiredData: Observable<any>;
  title: string;
  isLinear: boolean;
  action: string;

  id: string;

  processedAdaptationAction: AdaptationAction;
  adaptationAction$: Observable<AdaptationAction>;

  startDate = new Date(1990, 0, 1);
  displayFinancialSource: boolean;

  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
  }

  constructor(
    private route: ActivatedRoute,
    private service: AdaptationActionService,
  ) {
    this.title = 'Update adaptation action';
    this.isLinear = true;
    this.action = 'update';
    this.id = this.route.snapshot.paramMap.get('id');
    this.adaptationAction$ = this.service.loadOneAdaptationActions(this.id).pipe(
      tap((adaptationAction: AdaptationAction) => {
        this.processedAdaptationAction = adaptationAction;
        this.service.updateCurrentAdaptationAction(adaptationAction);
      }),
    );
  }

  ngOnInit() {}

  activateInsured(id: number): void {
    this.displayFinancialSource = id !== 1;
  }
}
