import { Component, OnInit } from '@angular/core';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { Ppcn } from '@app/ppcn/ppcn_registry';
import { Router, ActivatedRoute } from '@angular/router';
import { I18nService } from '@app/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ppcn',
  templateUrl: './ppcn.component.html',
  styleUrls: ['./ppcn.component.scss']
})
export class PpcnComponent implements OnInit {

  ppcn: Ppcn;
  isLoading: boolean;
  id: string;

  constructor(private router: Router,
    private i18nService: I18nService,
    private service: PpcnService,
    private route: ActivatedRoute) { 
      this.id = this.route.snapshot.paramMap.get('id');
    }

  ngOnInit() {
    this.isLoading = true;
    this.service.getPpcn(this.id, this.i18nService.language.split('-')[0])
     .pipe(finalize(() => { this.isLoading = false; }))
     .subscribe((response: Ppcn) => { this.ppcn = response; });
  }

}
