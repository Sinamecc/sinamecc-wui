import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { finalize, tap } from 'rxjs/operators';
import { UploadProposalService } from '@app/shared/upload-proposal/upload-proposal.service';


const log = new Logger('UploadProposal');

@Component({
  selector: 'app-upload-proposal',
  templateUrl: './upload-proposal.component.html',
  styleUrls: ['./upload-proposal.component.scss']
})
export class UploadProposalComponent implements OnInit, OnChanges {

  @Input() title: string;
  @Input() code: string;
  @Input() nextRoute: string;
  @Input() formSubmitRoute: string;
  @Input() entity: any;
  @Input() formData: FormData;
  @Output() formSubmitted = new EventEmitter<any>();



  error: string;
  form: FormGroup;
  isLoading = false;

  constructor(private router: Router,
    private i18nService: I18nService,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private service: UploadProposalService) {

    }

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.createForm();
  }

  submitForm() {
    this.isLoading = true;
    this.formSubmitted.emit(this.form.value);
    this.service.uploadProposal(this.form.value, this.entity , this.formSubmitRoute, this.formData)
      .pipe(finalize(() => {
        this.form.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe((response: any) => {
        this.router.navigate([this.nextRoute], { replaceUrl: true });
        this.translateService
          .get('Sucessfully submitted form')
            .subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
        log.debug(`${response.statusCode} status code received from form`);

      }, (error: any) => {
        log.debug(`Upload Proposal error: ${error}`);
        this.error = error;
      });
  }

  private createForm() {
    this.form = this.formBuilder.group({
      commentCtrl: ['', Validators.required],
      entityCtrl: [this.entity.id, Validators.required],
      fileCtrl: [{ value: undefined, disabled: false }, []],
    });
  }

}
