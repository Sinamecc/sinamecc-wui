import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { PpcnComponent } from '@app/ppcn/ppcn/ppcn.component';
import { UpdateStatusService } from './update-status.service';
import { Logger } from '@core/logger.service';
import { AdaptationActionsViewComponent } from '@app/adaptation-actions/adaptation-actions-view/adaptation-actions-view.component';
import { ReportViewComponent } from '@app/report/report-view/report-view.component';
import { MitigationActionComponent } from '@app/mitigation-actions/mitigation-action/mitigation-action.component';
import { MatSnackBar } from '@angular/material/snack-bar';

const log = new Logger('UploadProposal');

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss'],
  standalone: false,
})
export class UpdateStatusComponent implements OnInit {
  @Input() title: string;
  @Input() nextRoute: string;
  @Input() formSubmitRoute: string;
  @Input() entity: any;
  @Input() statuses: any;
  @Input() formData: FormData;
  @Input() shouldDisplayComment: boolean;
  @Output() formSubmitted = new EventEmitter<any>();
  @Input() module: string;

  @ViewChild('commentContainer', { read: ViewContainerRef }) container: any;

  moduleRef: any;

  error: string;
  form: UntypedFormGroup;
  isLoading = false;
  comment = false;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: UntypedFormBuilder,
    private translateService: TranslateService,
    private service: UpdateStatusService,
    private resolver: ComponentFactoryResolver,
  ) {
    this.loadComponent();
  }

  ngOnInit() {
    this.createForm();
  }

  loadComponent() {
    if (this.module === 'ppcn') {
      this.loadPPCNCommentComponent();
    }

    if (this.module === 'aa') {
      this.loadAAComponent();
    }

    if (this.module === 'report') {
      this.loaReportComponent();
    }

    if (this.module === 'ma') {
      this.loadMAComponent();
    }
  }

  loadPPCNCommentComponent() {
    const siglePostFactory = this.resolver.resolveComponentFactory(PpcnComponent);
    this.moduleRef = this.container.createComponent(siglePostFactory);
    this.moduleRef.instance.edit = true;
  }

  loadAAComponent() {
    const siglePostFactory = this.resolver.resolveComponentFactory(AdaptationActionsViewComponent);
    this.moduleRef = this.container.createComponent(siglePostFactory);
    this.moduleRef.instance.edit = true;
  }

  loaReportComponent() {
    const siglePostFactory = this.resolver.resolveComponentFactory(ReportViewComponent);
    this.moduleRef = this.container.createComponent(siglePostFactory);
    this.moduleRef.instance.edit = true;
  }

  loadMAComponent() {
    const siglePostFactory = this.resolver.resolveComponentFactory(MitigationActionComponent);
    this.moduleRef = this.container.createComponent(siglePostFactory);
    this.moduleRef.instance.edit = true;
  }

  private createForm() {
    this.form = this.formBuilder.group({
      statusCtrl: ['', Validators.required],
      descriptionCtrl: ['', null],
    });
  }

  submitForm() {
    this.isLoading = true;
    const context = {
      fsm_state: this.form.value.statusCtrl,
      comments: this.moduleRef ? this.moduleRef.instance.buildFormatComments(this.moduleRef.instance.comments) : [],
    };

    this.formSubmitted.emit(context);
    this.service
      .updateStatus(context, this.formSubmitRoute)
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        }),
      )
      .subscribe(
        (response: any) => {
          this.router.navigate([this.nextRoute], { replaceUrl: true });
          this.translateService.get('Sucessfully submitted form').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`${response.statusCode} status code received from form`);
        },
        (error: any) => {
          log.debug(`Upload Proposal error: ${error}`);
          this.error = error;
        },
      );
  }

  compareIds(id1: any, id2: any): boolean {
    const a1 = determineId(id1);
    const a2 = determineId(id2);
    return a1 === a2;
  }
}

export function determineId(id: any): string {
  if (id.constructor.name === 'array' && id.length > 0) {
    return '' + id[0];
  }
  return '' + id;
}
