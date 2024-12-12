import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss'],
  standalone: false,
})
export class RestorePasswordComponent implements OnInit {
  token: string;
  code: string;

  password: string;
  confirmPassword: string;

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private translateService: TranslateService,
  ) {
    if (this.route.snapshot.queryParams['code'] && this.route.snapshot.queryParams['token']) {
      this.token = this.route.snapshot.queryParams['token'];
      this.code = this.route.snapshot.queryParams['code'];
    }
  }

  changePassword(password: string) {
    const context = {
      token: this.token,
      code: this.code,
      password: password,
    };

    this.authenticationService.restorePassword(context).subscribe(
      (response: any) => {
        this.router.navigate(['/login'], { replaceUrl: true });

        this.translateService.get('Password is reset successfully').subscribe((res: string) => {
          this._snackBar.open(res, null, { duration: 1000 });
        });
      },
      (error: any) => {
        this.translateService.get('Error processing the request, please try again later').subscribe((res: string) => {
          this._snackBar.open(res, null, { duration: 2000 });
        });
      },
    );
  }

  ngOnInit() {}
}
