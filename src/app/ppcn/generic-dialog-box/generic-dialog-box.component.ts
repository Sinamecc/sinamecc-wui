import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-generic-dialog-box',
  templateUrl: './generic-dialog-box.component.html',
  styleUrls: ['./generic-dialog-box.component.scss'],
  standalone: false,
})
export class GenericDialogBoxComponent implements OnInit {
  @Input() moduleName: string;
  @Input() fieldsModule: object[];
  @Input() comments: object[];
  @Input() forms = false;

  @ViewChild('fieldsOrganizationInformation')
  fieldsOrganizationInformation: any;
  @ViewChild('commentOrganizationInformation')
  commentOrganizationInformation: any;

  constructor() {}

  ngOnInit() {}

  createComment(fields: string[], comment: string) {
    if (!this.comments.length) {
      const newModule = {
        module: this.moduleName,
        comments: [
          {
            fields: fields,
            comment: comment,
          },
        ],
      };

      this.comments.push(newModule);
    } else {
      const newModule = this.comments.find((x) => x['module'] === this.moduleName);

      if (newModule) {
        const newComment = {
          fields: fields,
          comment: comment,
        };
        newModule['comments'].push(newComment);
      } else {
        const newMod = {
          module: this.moduleName,
          comments: [
            {
              fields: fields,
              comment: comment,
            },
          ],
        };

        this.comments.push(newMod);
      }
    }
    this.clearForm();
  }

  clearForm() {
    this.fieldsOrganizationInformation._value = [];
    this.commentOrganizationInformation.nativeElement['value'] = '';
  }
}
