import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Logger } from '@core/logger.service';
import { finalize } from 'rxjs/operators';
import { UploadProposalService } from '@shared/upload-proposal/upload-proposal.service';
import { SnackbarService } from '../snackbar-service/snackbar.service';

const log = new Logger('UploadProposal');

@Component({
  selector: 'app-upload-proposal',
  templateUrl: './upload-proposal.component.html',
  styleUrls: ['./upload-proposal.component.scss'],
  standalone: false,
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
  form: UntypedFormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    public snackBar: SnackbarService,
    private formBuilder: UntypedFormBuilder,
    private service: UploadProposalService,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.createForm();
  }

  submitForm() {
    this.isLoading = true;
    this.formSubmitted.emit(this.form.value);
    this.service
      .uploadProposal(this.form.value, this.entity)
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.router.navigate([this.nextRoute], { replaceUrl: true });
          this.snackBar.show('Sucessfully submitted form');
          log.debug(`${response.statusCode} status code received from form`);
        },
        error: (error: any) => {
          log.debug(`Upload Proposal error: ${error}`);
          this.error = error;
        },
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
