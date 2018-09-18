import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { DataSource } from '@angular/cdk/table';

import { PpcnService } from '@app/ppcn/ppcn.service';
import { I18nService } from '@app/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Ppcn } from '@app/ppcn/ppcn_registry';
import { Observable } from 'rxjs';
import { ComponentDialogComponent } from '@app/core/component-dialog/component-dialog.component';

@Component({
  selector: 'app-ppcn-list',
  templateUrl: './ppcn-list.component.html',
  styleUrls: ['./ppcn-list.component.scss']
})
export class PpcnListComponent implements OnInit {

  version: string = environment.version;
  error: string;
  isLoading = false;
  dataSource = new PpcnSource(this.service,this.i18nService);
  displayedColumns = ['id_ppcn', 'organization_ppcn', 'request_type', 'required_recognition', 'sector','subsector', 'actions'];

  constructor(private router: Router,
    private i18nService: I18nService,
    private service: PpcnService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  view(uuid: string) {
    this.router.navigate([`/ppcn/${uuid}`], { replaceUrl: true });
  }

  delete(uuid: string) {
    this.isLoading = true;
     this.service.deletePpcn(uuid).subscribe(() =>{
       // here i need to refresh table
       this.isLoading = false;
       this.dataSource = new PpcnSource(this.service, this.i18nService);
     } );
 
   }
  
  update(uuid: string) {
    this.router.navigate([`ppcn/${uuid}/edit`], { replaceUrl: true });
  }

  openDeleteConfirmationDialog(uuid:string) {
    const data = {
      title: "Delete PPCN",
      question: "Are you sure?",
      uuid: uuid
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.width = '350px';
    let dialogRef = this.dialog.open(ComponentDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.delete(uuid);
      }
    });
  }

}


export class PpcnSource extends DataSource<any> {
  constructor(private service: PpcnService,
              private i18nService: I18nService,) {
    super();
  }
  connect(): Observable < Ppcn[] > {
    return this.service.ppcn(this.i18nService.language.split('-')[0]);
  }
  disconnect() {}
}
