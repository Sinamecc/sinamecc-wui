import { Component, Inject, inject } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAFile, MitigationAction } from '../mitigation-action';

export interface DialogData {
  id: string;
  form: UntypedFormGroup;
}
@Component({
  selector: 'app-reporting-climate-action-form',
  templateUrl: './reporting-climate-action-form.component.html',
  styleUrls: ['./reporting-climate-action-form.component.scss'],
  standalone: false,
})
export class ReportingClimateActionFormComponent {
  readonly dialogRef = inject(MatDialogRef<ReportingClimateActionFormComponent>);
  wasSubmittedSuccessfully = false;
  file: MAFile = {
    file: null,
    name: '',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string; form: UntypedFormGroup; mitigationAction: MitigationAction },
  ) {}

  get formArray(): AbstractControl | null {
    return this.data.form.get('formArray');
  }

  submitForm(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    const name = element.name;
    if (fileList) {
      this.file = {
        file: fileList[0],
        name: name,
      };
    }
  }
}
