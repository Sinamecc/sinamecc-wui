import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUpload, FileUploaded } from './file-upload';

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
  @Input() filesUploaded: FileUploaded[] = [];
  filesToUpload: File[] = [];
  filesToRemove: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  fileChanged(event) {
    const files = event.target.files;
    if (files) {
      this.filesToUpload = Array.from(new Set([...this.filesToUpload, ...Array.from<File>(files)]));
      this.fileChange.emit({
        type: this.type,
        filesToUpload: this.filesToUpload,
        filesUploaded: this.filesUploaded,
        filesToRemove: this.filesToRemove,
      });
      (event.target as HTMLInputElement).value = '';
    } else {
      this.clearFiles();
    }
  }

  get filesToShow() {
    return [...this.filesUploaded, ...this.filesToUpload];
  }

  clearFiles() {
    this.fileChange.emit({ filesToUpload: [], filesUploaded: [], type: this.type });
    this.filesToUpload = [];
  }

  removeFile(file: File | FileUploaded) {
    if (!(file as FileUploaded).id) {
      const index = this.filesToUpload.indexOf(file as File);
      if (index > -1) {
        this.filesToUpload = this.filesToUpload.filter((f) => f !== file);
        this.fileChange.emit({
          type: this.type,
          filesToUpload: this.filesToUpload,
          filesUploaded: this.filesUploaded,
          filesToRemove: this.filesToRemove,
        });
        this.cdr.markForCheck();
      }
    } else {
      const fileUploaded = file as FileUploaded;
      if (this.filesUploaded.some((f) => f.id === fileUploaded.id)) {
        this.filesToRemove.push(fileUploaded.id.toString());
        this.fileChange.emit({
          type: this.type,
          filesToUpload: this.filesToUpload,
          filesUploaded: this.filesUploaded.filter((f) => f.id !== fileUploaded.id),
          filesToRemove: this.filesToRemove,
        });
        this.cdr.markForCheck();
      }
    }
  }
}
