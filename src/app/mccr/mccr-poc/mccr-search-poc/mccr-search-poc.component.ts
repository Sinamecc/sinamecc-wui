import { Component, OnInit } from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Mccr_POC } from '@app/mccr/mccr-poc/Mccr_POC';
import { MccrPocService } from '@app/mccr/mccr-poc/mccr-poc.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-mccr-search-poc',
  templateUrl: './mccr-search-poc.component.html',
  styleUrls: ['./mccr-search-poc.component.scss']
})
export class MccrSearchPocComponent implements OnInit {

  idMccrPoc:string
  mccr_poc: Mccr_POC;
  isLoading: boolean;
  id: string;
  constructor(private router: Router,
    private i18nService: I18nService,
    private service: MccrPocService,
    private route: ActivatedRoute) { 
      this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

  search(value:string){

    this.isLoading = true;
    this.service.getMccr_POC(value, this.i18nService.language.split('-')[0])
     .pipe(finalize(() => { this.isLoading = false; }))
     .subscribe((response: Mccr_POC) => { this.mccr_poc = response; }); 
     
  }

}
