import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-edit-password-dialog',
  templateUrl: './admin-edit-password-dialog.component.html',
  styleUrls: ['./admin-edit-password-dialog.component.scss','../../../customCss.scss']
})
export class AdminEditPasswordDialogComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  error: string;

  constructor(private formBuilder: FormBuilder) { 
    this.createForm();
  }

  ngOnInit() {
  }

  private createForm(){
    this.form =  this.formBuilder.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],});
  }

  submit(){
    if(this.form.value.confirmPassword == this.form.value.newPassword){
      
    }else{
      this.error = 'Confirm password and new password are different.';
    }
  }

    

}
