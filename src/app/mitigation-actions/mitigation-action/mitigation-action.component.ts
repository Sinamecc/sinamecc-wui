import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MAFileType, MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { I18nService } from '@app/i18n';
import {
  commentsStructureModule1,
  commentsStructureModule2,
  commentsStructureModule3,
  commentsStructureModule4,
  commentsStructureModule5,
  commentsStructureModule6,
  TypeDataMap,
} from '../comments-structure';
import { CommentsStructure, Comments } from '@app/@shared/comment';
import { CommentsViewComponent } from '@app/@shared/comments-view/comments-view.component';
import { MitigationActionReview } from '../mitigation-action-review';
import { MatDialog } from '@angular/material/dialog';
import { PermissionService } from '@app/@core/permissions.service';

@Component({
  selector: 'app-mitigation-action',
  templateUrl: './mitigation-action.component.html',
  styleUrls: ['./mitigation-action.component.scss'],
  standalone: false,
})
export class MitigationActionComponent implements OnInit {
  mitigationAction: any;
  isLoading: boolean;
  id: string;
  @Input() edit = false;

  commentsModule1 = commentsStructureModule1;
  commentsModule2 = commentsStructureModule2;
  commentsModule3 = commentsStructureModule3;
  commentsModule4 = commentsStructureModule4;
  commentsModule5 = commentsStructureModule5;
  commentsModule6 = commentsStructureModule6;
  commentsByModule = {};
  reviews: MitigationActionReview[];
  typeDataMapDict = TypeDataMap;
  fileType = MAFileType;
  files: { [key: string]: any } = {};

  constructor(
    private i18nService: I18nService,
    private service: MitigationActionsService,
    public permissions: PermissionService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  get state() {
    return this.mitigationAction && this.mitigationAction.fsm_state.state;
  }

  findQuestion(id: string, check = false) {
    if (this.mitigationAction) {
      if (this.mitigationAction.impact_documentation.question) {
        const element = this.mitigationAction.impact_documentation.question.find(
          (x: { code: string }) => x.code === id,
        );

        if (check) {
          return element.check ? 'general.yes' : 'No';
        }
        return element.detail;
      }
    }
    return '';
  }

  openCommentsModal(commentStructure: CommentsStructure[], moduleIndex: number) {
    const commentList: Comments[] = this.buildCommentList(moduleIndex);
    const dialogRef = this.dialog.open(CommentsViewComponent, {
      width: '60%',
      disableClose: true,
      data: {
        edit: this.edit,
        moduleIndex: moduleIndex,
        comments: commentStructure,
        commentPayload: !this.edit
          ? commentList
          : this.commentsByModule[moduleIndex]
            ? this.commentsByModule[moduleIndex]
            : [],
      },
    });

    dialogRef.afterClosed().subscribe((result: Comments[]) => {
      if (result) {
        this.commentsByModule[moduleIndex] = result;
      }
    });
  }

  buildCommentList(moduleIndex: number) {
    const commentList: Comments[] = [];

    this.mitigationAction.comments.map((x: any) => {
      const module = x.form_section.split('-');

      if (module[0] === moduleIndex.toString()) {
        commentList.push({ moduleIndex: moduleIndex, module: module[1], subModule: x.field, comment: x.comment });
      }
    });
    return commentList;
  }

  ngOnInit() {
    this.isLoading = true;
    this.loadReviews();
    this.service
      .getMitigationAction(this.id, this.i18nService.language.split('-')[0])
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((response: MitigationAction) => {
        this.mitigationAction = response;

        Object.values(MAFileType).forEach((type: MAFileType) => {
          if (type !== MAFileType.INDICATOR_METHODOLOGICAL_DETAIL && type !== MAFileType.INDICATOR_SUSTAINABILITY)
            this.files[type] = this.getFilesByType(type);
        });
      });
  }

  loadReviews() {
    this.isLoading = true;
    this.service
      .mitigationActionReviews(this.id)
      .subscribe((response) => {
        this.reviews = response;
      })
      .add(() => (this.isLoading = false));
  }

  onEdit(uuid: string) {
    this.router.navigate([`mitigation/actions/${uuid}/edit`], { replaceUrl: true });
  }

  view(uuid: string) {
    this.router.navigate([`/mitigation/actions/${uuid}/reviews/new`], { replaceUrl: true });
  }

  formatAmount(currency: string, amount: number | string): string {
    const number = parseFloat(amount as string);
    if (isNaN(number)) return `${currency} - `;
    const formattedAmount = number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${currency} - ${formattedAmount}`;
  }

  buildFormatComments() {
    let commentList: any = [];
    const commentsKeys = Object.keys(this.commentsByModule);

    for (const element of commentsKeys) {
      const comments: Comments[] = this.commentsByModule[element];

      const formatComments = comments.map((x) => {
        return {
          form_section: `${x.moduleIndex}-${x.module}`,
          comment: x.comment,
          field: x.subModule,
        };
      });
      commentList = commentList.concat(formatComments);
    }

    return commentList;
  }

  getFilesByType(type: MAFileType, id?: string) {
    if (type === MAFileType.INDICATOR_METHODOLOGICAL_DETAIL || type === MAFileType.INDICATOR_SUSTAINABILITY) {
      const indicator = this.mitigationAction.monitoring_information.indicator.find((indicator) => indicator.id === id);
      return !indicator ? [] : indicator.files.filter((file) => file.type === type);
    } else if (type === MAFileType.MONITORING_UPDATED_DATA) {
      // TODO: add id when issue SIN-I75 is solved
      return this.mitigationAction.monitoring_reporting_indicator.monitoring_indicator[0].files.filter(
        (file) => file.type === type,
      );
    } else {
      return this.mitigationAction.files.filter((file) => file.type === type);
    }
  }

  hasFiles(type: MAFileType): boolean {
    return this.files && this.files[type] && this.files[type].length > 0;
  }
}
