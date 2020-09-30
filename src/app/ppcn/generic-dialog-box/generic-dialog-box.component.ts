import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-generic-dialog-box',
  templateUrl: './generic-dialog-box.component.html',
  styleUrls: ['./generic-dialog-box.component.scss']
})
export class GenericDialogBoxComponent implements OnInit {

  @Input() moduleName: string;
  @Input() fieldsModule: object[];
  @Input() comments: object[];
  @Input() forms: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  createComment(flieds:string[], comment:string){
  if(this.comments.length === 0){
     const newModule = {
      module: this.moduleName,
      comments: [
        {
          fields : flieds,
          comment : comment
        }
      ]
    }

    this.comments.push(newModule)

  }else{

    const newModule = this.comments.find(x => x['module']=== this.moduleName);
    console.log(newModule);
    if(newModule){
      const newComment = {
        fields : flieds,
        comment : comment
      }
      newModule['comments'].push(newComment);
    }else{

      const newModule = {
        module: this.moduleName,
        comments: [
          {
            fields : flieds,
            comment : comment
          }
        ]
      }

      this.comments.push(newModule)

    }

  }
  }

}
