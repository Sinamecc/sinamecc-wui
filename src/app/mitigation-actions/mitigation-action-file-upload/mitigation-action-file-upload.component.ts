import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MAFile } from './file-upload';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MAEntityType } from '../mitigation-action';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-mitigation-action-file-upload',
  templateUrl: './mitigation-action-file-upload.component.html',
  styleUrls: ['./mitigation-action-file-upload.component.scss'],
  standalone: false,
})
export class MitigationActionFileUploadComponent {
  @Input() maId: string = '';
  @Input() type: string = '';
  @Input() entityType?: MAEntityType; // optional
  @Input() entityId: string | null = null;
  @Input() accept: string = '';
  @Input() filesUploaded: MAFile[] = [];

  @Output() filesToUpload = new EventEmitter<File[]>();

  files: MAFile[] = [];
  filesUploading: File[] = [];
  loading: boolean = false;

  constructor(private service: MitigationActionsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['maId']) {
      const prevId = changes['maId'].previousValue;
      const currId = changes['maId'].currentValue;
      if (currId && prevId !== currId) {
        this.filesUploading = [];
        this.filesToUpload.emit([]);
        if (!this.entityType && this.maId) {
          this.files = this.filesUploaded;
        }
      }
    }

    if (changes['entityId']) {
      const prevEntityId = changes['entityId'].previousValue;
      const currEntityId = changes['entityId'].currentValue;
      if (this.entityType && currEntityId && prevEntityId !== currEntityId) {
        this.filesUploading = [];
        this.filesToUpload.emit([]);
        if (this.entityType && this.maId) {
          this.files = this.filesUploaded;
        }
      }
    }
  }

  get filesToShow(): (MAFile | File)[] {
    return [...this.files, ...this.filesUploading];
  }

  async loadFiles(): Promise<void> {
    this.loading = true;
    await this.refreshFiles();
    this.loading = false;
  }

  async loadEntityFiles(): Promise<void> {
    if (!this.entityId || !this.entityType) return;
    this.loading = true;
    await this.refreshEntityFiles();
    this.loading = false;
  }

  noId() {
    return !this.maId || (this.maId && this.entityType && !this.entityId);
  }

  async uploadFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input?.files ? Array.from(input.files) : [];
    if (!files.length) return;
    if (this.noId()) {
      this.filesUploading = [...this.filesUploading, ...files];
      this.filesToUpload.emit(this.filesUploading);
    } else {
      this.filesUploading = files;
      try {
        if (this.entityType && this.entityId) {
          await this.uploadEntityFiles(files);
          await this.refreshEntityFiles();
        } else {
          await this.uploadFiles(files);
          await this.refreshFiles();
        }
      } catch (error) {
        console.error('Error uploading files:', error);
      } finally {
        this.filesUploading = [];
      }
    }
  }

  async removeFile(file: string | number | File): Promise<void> {
    if (!file) return;
    if (!this.maId) {
      if (file instanceof File) {
        this.filesUploading = this.filesUploading.filter((f) => f !== file);
        this.filesToUpload.emit(this.filesUploading);
      }
    } else if (!(file instanceof File)) {
      try {
        await firstValueFrom(this.service.deleteFile(this.maId, [file.toString()]));
        this.files = this.files.filter((f) => f.id !== file);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  }

  private async uploadFiles(files: File[]): Promise<void> {
    await firstValueFrom(this.service.submitFiles(this.maId, this.type, files));
  }

  private async uploadEntityFiles(files: File[]): Promise<void> {
    if (!this.entityId || !this.entityType) return;
    await firstValueFrom(this.service.submitFiles(this.maId, this.type, files, this.entityId, this.entityType));
  }

  private async refreshFiles(): Promise<void> {
    const files = await firstValueFrom(this.service.getFiles(this.maId));
    this.files = files.filter((file: MAFile) => file.type === this.type);
  }

  private async refreshEntityFiles(): Promise<void> {
    if (!this.entityId || !this.entityType) return;
    const files = await firstValueFrom(this.service.getFiles(this.maId, this.entityId, this.entityType));
    this.files = files.filter((file: MAFile) => file.type === this.type);
  }
}
