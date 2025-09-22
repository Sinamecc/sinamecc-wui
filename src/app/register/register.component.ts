import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { FileUpload, FileUploaded } from '@app/@shared/upload-button/file-upload';
import { RegisterService } from './register.service';
import { UploadButtonComponent } from '@app/@shared/upload-button/upload-button.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: false,
})
export class RegisterComponent {
  @ViewChild(UploadButtonComponent) uploader: UploadButtonComponent;
  form: FormGroup;
  loading = false;
  filesToUpload: File[] = [];
  type = 'letter';

  constructor(
    private fb: FormBuilder,
    private service: RegisterService,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      entity: ['', Validators.required],
      position: ['', Validators.required],
      entityType: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      module: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    });
  }

  onFileChange(event: FileUpload) {
    this.filesToUpload = event.filesToUpload;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = {
      ...this.form.value,
    };

    console.log('submit payload', payload, this.filesToUpload);
    this.onReset();
    this.loading = false;
  }

  onReset() {
    this.form.reset({ aceptaTerminos: false });
    this.filesToUpload = [];
    this.uploader.clearFiles();
  }
}
