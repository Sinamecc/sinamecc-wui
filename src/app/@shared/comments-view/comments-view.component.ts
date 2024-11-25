import { Component, Inject, OnInit } from '@angular/core';
import { Comments, CommentsStructure } from '../comment';
import { CommentsAddComponent } from '../comments-add/comments-add.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-comments-view',
  templateUrl: './comments-view.component.html',
  styleUrls: ['./comments-view.component.scss'],
  standalone: false,
})
export class CommentsViewComponent implements OnInit {
  addCommentFields: CommentsStructure;
  comments: Comments[] = [];
  moduleIndex: number;
  edit: boolean;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.addCommentFields = data.comments;
    this.comments = data.commentPayload;
    this.moduleIndex = data.moduleIndex;
    this.edit = data.edit;
  }

  ngOnInit(): void {}

  openAddCommentsModal() {
    const dialogRef = this.dialog.open(CommentsAddComponent, {
      width: '60%',
      data: {
        fields: this.addCommentFields,
      },
    });

    dialogRef.afterClosed().subscribe((result: Comments) => {
      if (result) {
        result.moduleIndex = this.moduleIndex;
        this.comments.push(result);
      }
    });
  }

  deleteComment(index: number) {
    this.comments.splice(index, 1);
  }
}
