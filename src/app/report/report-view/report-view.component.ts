import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comments, CommentsStructure } from '@app/@shared/comment';
import { CommentsViewComponent } from '@app/@shared/comments-view/comments-view.component';
import {
  commentsStructureModule1,
  commentsStructureModule2,
  commentsStructureModule3,
  sourceTypeMap,
} from '../interfaces/comments-structure';
import { geographicCoverageMap, Report } from '../interfaces/report';
import { formationReportedMap, reportingPeriodicity } from '../interfaces/report-data';
import { ReportService } from '../report.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss'],
})
export class ReportViewComponent implements OnInit {
  report: Report;
  id: string = '';
  edit = false;
  loading = false;
  files = {};
  loadingFiles = false;
  geographicCoverage = geographicCoverageMap;

  commentsModule1 = commentsStructureModule1;
  commentsModule2 = commentsStructureModule2;
  commentsModule3 = commentsStructureModule3;
  sourceTypeMapDict = sourceTypeMap;
  commentsByModule = {};
  informationReportMapFields = formationReportedMap;
  reportingPeriodicityMap = reportingPeriodicity;

  constructor(private service: ReportService, private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadReport(this.id);
  }

  buildCommentList(moduleIndex: number) {
    const commentList: Comments[] = [];

    this.report.comments.map((x: any) => {
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

  async loadFile() {
    this.loadingFiles = true;
    for (const file of this.report.files) {
      const s3File = await this.service.downloadResource(file.file.replace('/api', ''), file.filename);
      this.files[file.report_type] = s3File;
    }

    this.loadingFiles = false;
  }

  downloadFile(key: string) {
    const element = this.files[key];
    const file = document.createElement('a');
    const url = window.URL.createObjectURL(element.data);
    file.href = url;
    file.download = element.filename;

    file.click();
    window.URL.revokeObjectURL(url);
  }

  private loadReport(id: string) {
    this.loading = true;
    this.service
      .report(id)
      .subscribe(async (response) => {
        this.report = response;
        if (this.report.files.length > 0) {
          await this.loadFile();
        }
      })
      .add(() => (this.loading = false));
  }
}
