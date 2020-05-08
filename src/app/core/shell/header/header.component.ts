import { Title, DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';

import { AuthenticationService, Credentials} from '@app/core/authentication/authentication.service';
import { I18nService } from '@app/core/i18n.service';
import { Permissions } from '@app/core/permissions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  logoName : string;
  userImage:string | SafeUrl = 'assets/default_user_image.png';

  @Input() sidenav: MatSidenav;

  constructor(private router: Router,
              private titleService: Title,
              private authenticationService: AuthenticationService,
              private i18nService: I18nService,
              private sanitizer: DomSanitizer) {
                this.logoName = "logo-white-nav.png";
               }

  ngOnInit() { 
    this.getUserPhoto();
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() { 
    this.authenticationService.logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get permissions(): Permissions{
    return this.authenticationService.credentials.permissions;
  }

  get credential():Credentials{
    return this.authenticationService.credentials;
  }

  get username(): string {
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.username : null;
  }
  get groups(): object {
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.groups : null;
  }
  get title(): string {
    return this.titleService.getTitle();
  }

  showModule(permissions:Permissions,module:string){
    if(permissions.all){
      return true;
    }else{
      return Boolean(permissions[module])
    } 
  }

  getCurrentPhoto(photoList:any[]){
    for(let photo of photoList){
      if(photo.current){
        return photo;
      }
    }
    return undefined
  }

  getUserPhoto(){
    const userPhoto = this.getCurrentPhoto(this.credential.userPhoto)
    if(userPhoto){
      this.authenticationService.getUserPhoto(userPhoto.image).subscribe((image: any) =>{ 
        this.userImage = this.sanitizer.bypassSecurityTrustUrl(this.createImageFromBlob(image)); 
      });
    }
  }

  createImageFromBlob(image: Blob) {
    return URL.createObjectURL(image)
 }

}
