import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService,
  ) {}

  show(key: string, params: string[] = [], duration = 3000, action = '') {
    const translated = this.translate.instant(key);
    const message = params.length ? `${params.join(' ')} ${translated}` : translated;
    this.snackBar.open(message, action, { duration });
  }
}
