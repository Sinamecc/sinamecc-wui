import { Component, Inject, OnInit } from '@angular/core';
import { Comments, CommentsStructure } from '../comment';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comments-add',
  templateUrl: './comments-add.component.html',
  styleUrls: ['./comments-add.component.scss'],
})
export class CommentsAddComponent implements OnInit {
  fields: CommentsStructure[] = [];
  subFields: string[] = [];
  comment: Comments = {
    module: '',
    subModule: '',
    comment: '',
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.fields = data.fields;
  }

  ngOnInit(): void {}

  loadSubModules(module: string) {
    const subModules = this.fields.find((x) => x.module === module);
    this.subFields = subModules.fields;
  }
}
