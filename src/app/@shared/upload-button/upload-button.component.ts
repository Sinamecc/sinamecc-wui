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
  @Input() files: File[] = [];
  filesToUpload: File[] = [];

  fileChanged(event) {
    const files = event.target.files;
    if (files) {
      const filesToUpload = Array.from<File>(files);
      this.filesToUpload = [...this.filesToUpload, ...Array.from<File>(files)];
      this.fileChange.emit({
        type: this.type,
        files: filesToUpload,
      });
    } else {
      this.clearFiles();
    }
  }

  get filesToShow() {
    const res = [...this.files, ...this.filesToUpload].map((file) => ({
      file: file,
      canDelete: this.filesToUpload.includes(file),
    }));
    return res;
  }

  clearFiles() {
    this.fileChange.emit({ files: null, type: '' });
    this.filesToUpload = [];
  }

  removeFile(file: File) {
    const index = this.filesToUpload.indexOf(file);
    if (index > -1) {
      this.filesToUpload = this.filesToUpload.filter((f) => f !== file);
      this.fileChange.emit({
        type: this.type,
        files: this.filesToUpload,
      });
    }
  }
}
