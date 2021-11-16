import { Component, OnInit } from '@angular/core';
import { ErrorDetail } from '../error';

@Component({
  selector: 'app-error-reporting',
  templateUrl: './error-reporting.component.html',
  styleUrls: ['./error-reporting.component.scss'],
})
export class ErrorReportingComponent implements OnInit {
  constructor() {}

  generalError = 'errorLabel.generalError';
  errorParse = [
    { code: 504, description: 'errorLabel.error504' },
    { code: 404, description: 'errorLabel.error-404' },
    { code: 500, description: 'errorLabel.error500' },
    {
      code: 401,
      description: 'errorLabel.error401',
    },
    { code: 400, description: 'errorLabel.error400' },
  ];

  errorToShow: string[] = [];
  showErrors = false;

  ngOnInit(): void {}

  buildErrors(error: object) {
    const codeToSend: ErrorDetail = {
      code: '',
      errors: [],
    };
    codeToSend['code'] = error['status'];
    if (error['status'] === 400) {
      const errorList = [];
      for (const element of Object.values(error['error'][0])) {
        errorList.push(element[0]);
      }

      codeToSend.errors = errorList;
    }

    return [codeToSend];
  }

  parseErrors(errorDetails: object) {
    const errorList: ErrorDetail[] = this.buildErrors(errorDetails);

    this.showErrors = true;
    this.errorToShow = [];
    for (const error of errorList) {
      const code = this.getCode(Number(error.code));
      if (code) {
        if (code.code === 400) {
          this.errorToShow = this.errorToShow.concat(error.errors);
        } else {
          this.errorToShow.push(code.description);
        }
      } else {
        this.errorToShow.push(this.generalError);
      }
    }
  }

  getCode(code: number) {
    return this.errorParse.find((error) => error.code === code);
  }
}
