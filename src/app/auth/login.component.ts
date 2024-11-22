import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { I18nService } from '@app/i18n';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public version: string = environment.version;
  public error: string;
  public loginForm: UntypedFormGroup;
  public isLoading = false;
  public forgotPassword = false;
  public emailValue: string;
  public candSendEmail = false;
  public sendEmail = false;

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
  ) {
    this.createForm();
  }

  ngOnInit() {}

  login() {
    this.isLoading = true;
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
      )
      .subscribe(
        (credentials) => {
          this.router.navigate(['/home'], { replaceUrl: true });
        },
        (error) => {
          this.error = error;
        },
      );
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  sendEmailRestarPassword(email: string) {
    this.authenticationService.sendEmailRestarPassword(email).subscribe((response) => {
      this.sendEmail = true;
    });
  }

  validateEmail(email: string) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
    });
  }
}
