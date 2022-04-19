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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { PpcnComponent } from '@app/ppcn/ppcn/ppcn.component';
import { UpdateStatusService } from './update-status.service';
import { Logger } from '@core/logger.service';
import { AdaptationActionsViewComponent } from '@app/adaptation-actions/adaptation-actions-view/adaptation-actions-view.component';

const log = new Logger('UploadProposal');

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss'],
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
  form: FormGroup;
  isLoading = false;
  comment = false;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private service: UpdateStatusService,
    private resolver: ComponentFactoryResolver
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

  private createForm() {
    this.form = this.formBuilder.group({
      statusCtrl: ['', Validators.required],
      descriptionCtrl: ['', null],
    });
  }

  submitForm() {
    this.isLoading = true;
    const context = {
      context: this.form.value,
      comments: this.moduleRef ? this.moduleRef.instance.buildFormatComments(this.moduleRef.instance.comments) : [],
    };

    this.formSubmitted.emit(context);
    this.service
      .updateStatus(context, this.formSubmitRoute)
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        })
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
  if (id.constructor.name === 'array' && id.length > 0) {
    return '' + id[0];
  }
  return '' + id;
}
