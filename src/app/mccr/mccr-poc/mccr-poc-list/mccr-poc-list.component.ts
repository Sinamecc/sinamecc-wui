import { Component, OnInit } from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { MccrPoc } from '@app/mccr/mccr-poc/mccr-poc';
import { MccrPocService } from '@app/mccr/mccr-poc/mccr-poc.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { finalize } from 'rxjs/operators';

import {MatDialog, MatDialogConfig} from "@angular/material";




@Component({
  selector: 'app-mccr-poc-list',
  templateUrl: './mccr-poc-list.component.html',
  styleUrls: ['./mccr-poc-list.component.scss']
})
export class MccrPocListComponent implements OnInit {

  
  mccr_poc: MccrPoc;
  isLoading: boolean;
  id: string;
  
  constructor(private router: Router,
    private i18nService: I18nService,
    private service: MccrPocService,
    private dialog: MatDialog,
    private route: ActivatedRoute) { 
      this.id = this.route.snapshot.paramMap.get('id');
  }

  animal: string;
  name: string;

  ngOnInit() {
    
    this.isLoading = true;
    this.service.getMccrPoc(this.id, this.i18nService.language.split('-')[0])
     .pipe(finalize(() => { this.isLoading = false; }))
     .subscribe((response: MccrPoc) => { this.mccr_poc = response; }); 

  }
  

  openAddBuyer(uuid: string){
      this.router.navigate([`/mccr/poc/${uuid}/add-Buyer-Transfer`], { replaceUrl: true });
  }

  openAddDeveloper(uuid: string){
    this.router.navigate([`/mccr/poc/${uuid}/add-Developer-Transfer`], { replaceUrl: true });
}

  

}



