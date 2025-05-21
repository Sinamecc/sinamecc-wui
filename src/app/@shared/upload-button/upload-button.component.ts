import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUpload } from './file-upload';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrl: './upload-button.component.scss',
  standalone: false,
})
export class UploadButtonComponent {
  @Input() accept: string = '';
  @Input() name: string = '';
  @Output() fileChange = new EventEmitter<FileUpload>();
  fileName: string = '';

  fileChanged(event) {
    const files = event.target.files;
    if (files) {
      this.fileChange.emit({
        name: this.name,
        file: files[0],
      });
      this.fileName = files[0].name;
    } else {
      this.clearFile();
    }
  }

  clearFile() {
    this.fileName = '';
    this.fileChange.emit({ name: this.name, file: null });
  }
}
