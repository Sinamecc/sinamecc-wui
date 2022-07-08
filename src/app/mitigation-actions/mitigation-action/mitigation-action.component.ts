import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Logger } from '@app/@core';
import { AuthenticationService, Credentials } from '@app/auth';
import { I18nService } from '@app/i18n';
import {
  commentsStructureModule1,
  commentsStructureModule2,
  commentsStructureModule3,
  commentsStructureModule4,
  commentsStructureModule5,
  commentsStructureModule6,
} from '../comments-structure';
import { async } from '@angular/core/testing';
import { CommentsStructure, Comments } from '@app/@shared/comment';
import { CommentsViewComponent } from '@app/@shared/comments-view/comments-view.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mitigation-action',
  templateUrl: './mitigation-action.component.html',
  styleUrls: ['./mitigation-action.component.scss'],
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
  reviews: any;

  constructor(
    private router: Router,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  findQuestion(id: string) {
    if (this.mitigationAction) {
      if (this.mitigationAction.impact_documentation.question) {
        return this.mitigationAction.impact_documentation.question.find((x: { code: string }) => x.code === id).detail;
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
        })
      )
      .subscribe((response: MitigationAction) => {
        this.mitigationAction = response;
      });
  }

  loadReviews() {
    this.service.mitigationActionReviews(this.id).subscribe((response) => {
      this.reviews = response;
    });
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
}
