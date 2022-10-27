import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthenticationService } from '../authentication.service';
import { SignUpPayload } from '../signupInterfaces';

/** Error when invalid control is dirty, touched, or submitted. */
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  isLoading = false;
  signupForm!: FormGroup;
  matcher = new CustomErrorStateMatcher();

  modules = [
    {
      name: 'PPCN',
      code: '1',
    },
    {
      name: 'Mitigation Actions',
      code: '2',
    },
    {
      name: 'Adaptation Actions',
      code: '3',
    },
    {
      name: 'Report Data',
      code: '4',
    },
    {
      name: 'MCCR',
      code: '5',
    },
  ];

  constructor(private formBuilder: FormBuilder, private service: AuthenticationService) {
    this.createForm();
  }

  ngOnInit(): void {}

  private createForm() {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{4,20}$')]],
      lastname: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{4,20}$')]],
      email: ['', [Validators.required, Validators.email]],
      permissions: ['', [Validators.required]],
      position: ['', [Validators.required]],
      institution: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{4,20}$')]],
    });
  }

  buildPayload() {
    const payload: SignUpPayload = {
      email: this.signupForm.value.email,
      first_name: this.signupForm.value.name,
      last_name: this.signupForm.value.lastname,
      institution: this.signupForm.value.institution,
      position: this.signupForm.value.position,
      module: this.signupForm.value.permissions,
    };
    console.log(payload);

    return payload;
  }

  submitForm(stepper: any) {
    this.isLoading = true;
    const payload: SignUpPayload = this.buildPayload();

    this.service
      .createNewUser(payload)
      .subscribe(() => {
        stepper.next();
      })
      .add(() => (this.isLoading = false));
  }
}
