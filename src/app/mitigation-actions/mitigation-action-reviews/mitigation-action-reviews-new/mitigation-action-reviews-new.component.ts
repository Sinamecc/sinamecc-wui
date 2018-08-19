import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationActionNewFormData, GeographicScale, Status, IngeiCompliance, Institution, FinanceSourceType } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { Observable } from 'rxjs/Observable';
import { MitigationActionReviewNewFormData, ReviewStatus } from '@app/mitigation-actions/mitigation-action-review-new-form-data';

const log = new Logger('Report');

@Component({
  selector: 'app-mitigation-action-reviews-new',
  templateUrl: './mitigation-action-reviews-new.component.html',
  styleUrls: ['./mitigation-action-reviews-new.component.scss']
})
export class MitigationActionReviewsNewComponent implements OnInit {

  version: string = environment.version;
  error: string;

  isLoading = false;
  id: string;
  mitigationActionObservable: Observable<MitigationAction>;
  // initalRequiredData: Observable<MitigationActionReviewNewFormData>;

  mitigationAction: MitigationAction;
  title: string;
  nextRoute: string;
  formData: FormData;
  formSubmitRoute: string;
  statusses: ReviewStatus[];


  processedMitigationActionsStatusses: MitigationActionReviewNewFormData;
  formValues: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private service: MitigationActionsService) {

      this.id = this.route.snapshot.paramMap.get('id');
      this.title = "Add a new review for this mitigation action";
      this.nextRoute = `mitigation/actions`;
      this.formData = new FormData();
      this.formSubmitRoute =  `/v1/mitigations/${this.id}`;
      this.statusses = [];
      
  
      this.mitigationActionObservable = this.service.getMitigationAction(this.id, this.i18nService.language.split('-')[0])
      .pipe(
        tap((mitigationAction: MitigationAction) => { this.mitigationAction = mitigationAction; this.statusses = mitigationAction.next_state })
      );

      
      // this.id = this.route.snapshot.paramMap.get('id');
      // this.createForm();
    }

  ngOnInit() {
  }

  // private createForm() {
  //   this.formGroup = this.formBuilder.group({
  //     review_status: ['', Validators.required],
  //     comment: ['', Validators.required]
  //   });

  //   this.formValues = forkJoin(
  //     this.initFormData(),
  //     this.initFormOptions(),   
  //     (formOptions, formData) => { 
  //       return { formOptions, formData };
  //     }
  //   );
  // }

  // private initFormOptions():Observable<MitigationActionReviewNewFormData> {
  //   let initialRequiredData = this.initialFormData().pipe(
  //     tap(mitigationActionReviewNewFormData => {
  //       this.isLoading = false;
  //       this.processedMitigationActionsStatusses = mitigationActionReviewNewFormData;
  //     }));
  //     return initialRequiredData;
  // }

  // private initialFormData():Observable<MitigationActionReviewNewFormData> {
  //   return this.service.getMitigationActionReviewStatuses()
  //   .pipe(finalize(() => { this.isLoading = false; }));

  // }


  // private initFormData():Observable<MitigationAction> {
  //   let mitigationAction = this.getMitigation().pipe(
      
  //     tap(mitigationAction => {
  //       this.formGroup.setValue({
  //         review_status: mitigationAction['review_status']['id'],
  //         comment: ''
  //       });
     
  //     }));
  //     return mitigationAction;
  // }

  // private getMitigation():Observable<MitigationAction> {
  //   return this.service.getMitigationAction(this.id, this.i18nService.language.split('-')[0])
  //   .pipe(finalize(() => { this.isLoading = false; }));

  // }

  // submitForm() {

  //   this.isLoading = true;
  //   this.service.submitNewMitigationActionReviewForm(this.formGroup.value, this.id)
  //     .pipe(finalize(() => {
  //       this.formGroup.markAsPristine();
  //       this.isLoading = false;
  //     }))
  //     .subscribe(response => {
  //       this.router.navigate(['/mitigation/actions'], { replaceUrl: true });
  //       log.debug(`${response.statusCode} status code received from form`);

  //     }, error => {
  //       log.debug(`Mitigation Action Review error: ${error}`);
  //       this.error = error;
  //     });

  // }

  onSubmission(context: any) {
    this.formData.append('comment', context.commentCtrl);
    this.formData.append('fsm_state', context.statusCtrl);
    this.formData.append('user',  String(this.authenticationService.credentials.id));
  }

  // compareIds(id1: any, id2: any): boolean {
  //   const a1 = determineId(id1);
  //   const a2 = determineId(id2);
  //   return a1 === a2;
  // }

}

// export function determineId(id: any): string {
//   if (id.constructor.name === 'array' && id.length > 0) {
//      return '' + id[0];
//   }
//   return '' + id;
// }
