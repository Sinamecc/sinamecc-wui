import { Component, OnInit } from '@angular/core';
import {MatPaginator, MatTableDataSource,MatSnackBar} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { MccrPoc } from '@app/mccr/mccr-poc/mccr-poc';
import { MccrPocService } from '@app/mccr/mccr-poc/mccr-poc.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { finalize } from 'rxjs/operators';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { ComponentDialogComponent } from '@app/core/component-dialog/component-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { MccrPocNewDeveloperAccountComponent } from '../mccr-poc-new-developer-account/mccr-poc-new-developer-account.component';
import { MccrPocNewBuyerAccountComponent } from '../mccr-poc-new-buyer-account/mccr-poc-new-buyer-account.component';


@Component({
  selector: 'app-mccr-search-poc',
  templateUrl: './mccr-search-poc.component.html',
  styleUrls: ['./mccr-search-poc.component.scss']
})
export class MccrSearchPocComponent implements OnInit {

  idMccrPoc:string
  mccr_poc: MccrPoc;
  isLoading: boolean;
  id: string;

  constructor(private router: Router,
    private i18nService: I18nService,
    private service: MccrPocService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute) { 
      this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

  openDialogDeveloper(): void {
    let dialogRef = this.dialog.open(MccrPocNewDeveloperAccountComponent, {
      width: '70%',
    });
  }

  openDialogBuyer(): void {
    let dialogRef = this.dialog.open(MccrPocNewBuyerAccountComponent, {
      width: '70%',
    });
  }

  search(value:string){
    this.isLoading = true;
    this.service.getMccrPoc(value.trim(), this.i18nService.language.split('-')[0])
     .pipe(finalize(() => { this.isLoading = false; }))
     .subscribe((response: MccrPoc) => { this.mccr_poc = response; }); 
  }

  view(uuid: string) {
    this.router.navigate([`/mccr/poc/detail/${uuid}`], { replaceUrl: true });
  }

  cancel(uuid:string){
    this.isLoading = true;
    this.service.cancelUcc(uuid).subscribe(() =>{
      this.isLoading = false;
      this.translateService.get('Sucessfully cancel element').subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
    } );
  }

  openDeleteConfirmationDialog(uuid:string){
    const data = {
      title: "Cancel UCC",
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
        this.cancel(uuid);
      }
    });
  }
  
  addUCC(){
    this.router.navigate([`/mccr/poc/new`], { replaceUrl: true });
  }



}
