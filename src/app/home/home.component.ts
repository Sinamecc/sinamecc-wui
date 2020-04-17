import { Component, OnInit, transition, animate, state, style, trigger } from '@angular/core';
import { Router } from '@angular/router';
import { Permissions } from '../core/permissions';
import { AuthenticationService } from '../core/authentication/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class HomeComponent implements OnInit {
  
  dataImage= [
    {
      image:'url(assets/ma_image.jpg)',
      name:'MA',
      url:'/mitigation/actions',
      moduleName:'ma'
    },
    {
      image:'url(assets/report_image.jpg)',
      name:'Report',
      url:"/report",
      moduleName:''
    },
    {
      image:'url(assets/mccr_image.jpg)',
      name:'MCCR',
      url:"/mccr/registries",
      moduleName:'mccr'
    },
    {
      image:'url(assets/admin_image.jpg)',
      name:'ADMIN',
      url:"/admin/users",
      moduleName:'admin'
    },
    {
      image:'url(assets/ppcn_image.jpg)',
      name:'PPCN',
      url:"/ppcn/registries",
      moduleName:'ppcn'
    },
  ]

  constructor(private router: Router, private authenticationService: AuthenticationService,) { }

  ngOnInit() {
  }

  goToSite(url:string){
    this.router.navigate([url], { replaceUrl: true });
  }

  get permissions(): Permissions{
    return this.authenticationService.credentials.permissions;
  }

  showModule(permissions:Permissions,module:string){
    if(permissions.all){
      return true;
    }else{
      return Boolean(permissions[module])
    } 
  }

}
