import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comments, CommentsStructure } from '@app/@shared/comment';
import { CommentsViewComponent } from '@app/@shared/comments-view/comments-view.component';
import { AdaptationActionService } from '../adaptation-actions-service';
import {
  commentsStructureModule1,
  commentsStructureModule2,
  commentsStructureModule3,
  commentsStructureModule4,
  commentsStructureModule5,
  commentsStructureModule6,
} from '../comments-structure';
import {
  actionState,
  adaptationActionClimateThreaMap,
  adaptationActionFinanceStatusMap,
  adaptationsActionsTypeMap,
  AppScale,
  classifiersSINAMECCMap,
  financeInstrumentMap,
  geographicCoverageMap,
  indicatorsTypeOfDataMap,
  provinciaMap,
  reportingEntityTypeMap,
  ReportingPeriodicity,
} from '../interfaces/catalogs';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-adaptation-actions-view',
  templateUrl: './adaptation-actions-view.component.html',
  styleUrls: ['./adaptation-actions-view.component.scss'],
  standalone: false,
})
export class AdaptationActionsViewComponent implements OnInit {
  id = '';
  adaptationAction: any = {};
  edit = false;
  reportingEntityType = reportingEntityTypeMap;
  adaptationsActionsType = adaptationsActionsTypeMap;
  provinciaType = provinciaMap;
  adaptationActionClimateThreaType = adaptationActionClimateThreaMap;
  adaptationActionFinanceStatusType = adaptationActionFinanceStatusMap;
  financeInstrumentType = financeInstrumentMap;
  indicatorsTypeOfDataType = indicatorsTypeOfDataMap;
  classifiersSINAMECCType = classifiersSINAMECCMap;
  actionStateSinamecc = actionState;
  AppScaleStructure = AppScale;
  reportingPeriodicityStructure = ReportingPeriodicity;

  commentsModule1 = commentsStructureModule1;
  commentsModule2 = commentsStructureModule2;
  commentsModule3 = commentsStructureModule3;
  commentsModule4 = commentsStructureModule4;
  commentsModule5 = commentsStructureModule5;
  commentsModule6 = commentsStructureModule6;
  geographicCoverage = geographicCoverageMap;

  loading = false;

  commentsByModule = {};

  constructor(
    private route: ActivatedRoute,
    private service: AdaptationActionService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadAdaptationAction();
    }
  }

  loadAdaptationAction() {
    this.loading = true;
    if (this.id) {
      this.service
        .loadOneAdaptationActions(this.id)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(
          (response) => {
            this.adaptationAction = response;
            if (this.adaptationAction && this.adaptationAction.indicator_list.length) {
              this.adaptationAction.indicator_list.forEach((indicator: any) => {
                if (indicator.same_contact_info_as_registration) {
                  indicator.contact = {
                    institution: this.adaptationAction.report_organization?.contact?.institution,
                    contact_name: this.adaptationAction.report_organization?.contact?.contact_name,
                    contact_position: this.adaptationAction.report_organization?.contact?.contact_position,
                    email: this.adaptationAction.report_organization?.contact?.email,
                    phone: this.adaptationAction.report_organization?.contact?.phone,
                  };
                }
              });
            }
          },
          (error) => {
            console.error(error);
          },
        );
    }
  }

  buildCommentList(moduleIndex: number) {
    const commentList: Comments[] = [];

    this.adaptationAction.comments.map((x: any) => {
      const module = x.form_section.split('-');

      if (module[0] === moduleIndex.toString()) {
        commentList.push({ moduleIndex: moduleIndex, module: module[1], subModule: x.field, comment: x.comment });
      }
    });
    return commentList;
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
