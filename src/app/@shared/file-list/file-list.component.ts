import { Component, Input } from '@angular/core';
import { FileUploaded } from '../upload-button/file-upload';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.scss',
  standalone: false,
})
export class FileListComponent {
  @Input() files: FileUploaded[] = [];

  viewFile(file: FileUploaded) {
    const link = document.createElement('a');
    link.href = file.file;
    link.download = file.metadata?.filename || 'download';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
