import { Component, OnInit, transition, animate, state, style, trigger } from '@angular/core';
import { Router } from '@angular/router';

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
      url:'/mitigation/actions'
    },
    {
      image:'url(assets/report_image.jpg)',
      name:'Report',
      url:"/report"
    },
    {
      image:'url(assets/mccr_image.jpg)',
      name:'MCCR',
      url:"/mccr/registries"
    },
    {
      image:'url(assets/admin_image.jpg)',
      name:'ADMIN',
      url:"/admin/users"
    },
    {
      image:'url(assets/ppcn_image.jpg)',
      name:'PPCN',
      url:"/ppcn/registries"
    },
  ]

  constructor(private router: Router,) { }

  ngOnInit() {
  }

  goToSite(url:string){
    this.router.navigate([url], { replaceUrl: true });
  }

}
