import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { SnackbarService } from '@app/@shared/snackbar-service/snackbar.service';

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
    private _snackBar: SnackbarService,
    private router: Router,
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
        this._snackBar.show('Password is reset successfully', [], 1000);
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      (error: any) => {
        this._snackBar.show('Error processing the request, please try again later', [], 1000);
      },
    );
  }

  ngOnInit() {}
}
