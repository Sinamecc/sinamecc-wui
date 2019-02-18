import { Component, OnInit } from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { MccrPoc } from '@app/mccr/mccr-poc/mccr-poc';
import { MccrPocService } from '@app/mccr/mccr-poc/mccr-poc.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { finalize } from 'rxjs/operators';

const data:string[] = ['something1'];

@Component({
  selector: 'app-mccr-poc-list',
  templateUrl: './mccr-poc-list.component.html',
  styleUrls: ['./mccr-poc-list.component.scss']
})
export class MccrPocListComponent implements OnInit {

  displayedColumns = ['field1','field2','field3','field4'];
  
  mccr_poc: MccrPoc;
  isLoading: boolean;
  id: string;
  
  dataSource = new MatTableDataSource<string>(data);
  constructor(private router: Router,
    private i18nService: I18nService,
    private service: MccrPocService,
    private route: ActivatedRoute) { 
      this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.isLoading = true;
    this.service.getMccrPoc('MMCR-CR-FC-2196-2738-2018-3015', this.i18nService.language.split('-')[0])
     .pipe(finalize(() => { this.isLoading = false; }))
     .subscribe((response: MccrPoc) => { this.mccr_poc = response; }); 

  }

}



