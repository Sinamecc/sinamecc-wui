import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material';
import { filter } from 'rxjs/operators';
import { AuthenticationService, Credentials } from '../authentication/authentication.service';
import { Permissions } from '../permissions';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private media: ObservableMedia,
    private authenticationService: AuthenticationService,) { }

  ngOnInit() {
    this.media.asObservable()
      .pipe(filter((change: MediaChange) => (change.mqAlias !== 'xs' && change.mqAlias !== 'sm')))
      .subscribe(() => this.sidenav.close());
  }

  get permissions(): Permissions{
    return this.authenticationService.credentials.permissions;
  }

  get credential():Credentials{
    return this.authenticationService.credentials;
  }

}
