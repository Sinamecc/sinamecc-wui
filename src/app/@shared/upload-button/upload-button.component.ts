import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUpload } from './file-upload';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss'],
  standalone: false,
})
export class UploadButtonComponent {
  @Input() accept: string = '';
  @Input() type: string = '';
  @Output() fileChange = new EventEmitter<FileUpload>();
  files: File[] = [];

  fileChanged(event) {
    const files = event.target.files;
    if (files) {
      this.files = Array.from(files);
      this.fileChange.emit({
        type: this.type,
        files: this.files,
      });
    } else {
      this.clearFiles();
    }
  }

  clearFiles() {
    this.fileChange.emit({ files: null, type: '' });
    this.files = [];
  }

  removeFile(file: File) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files = this.files.filter((f) => f !== file);
      this.fileChange.emit({
        type: this.type,
        files: this.files,
      });
    }
  }
}
