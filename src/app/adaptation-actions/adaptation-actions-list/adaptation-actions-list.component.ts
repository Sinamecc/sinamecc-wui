import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';
import { adaptationsActionsTypeMap } from '../interfaces/catalogs';

@Component({
  selector: 'app-adaptation-actions-list',
  templateUrl: './adaptation-actions-list.component.html',
  styleUrls: ['./adaptation-actions-list.component.scss'],
})
export class AdaptationActionsListComponent implements OnInit {
  adaptationsActions: AdaptationAction[] = [];
  dataSource: MatTableDataSource<AdaptationAction>;
  headers = ['id', 'name', 'type', 'objetive', 'fms_state', 'lastUpdate', 'created', 'actions'];
  loading = false;
  typesMap = adaptationsActionsTypeMap;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private service: AdaptationActionService,
    private router: Router,
    private credentialsService: CredentialsService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  view(uuid: string) {
    this.router.navigate([`/adaptation/actions/${uuid}`], {
      replaceUrl: true,
    });
  }

  edit(uuid: string) {
    this.router.navigate([`adaptation/actions/${uuid}/update`], { replaceUrl: true });
  }

  hasPermProvider() {
    return Boolean(
      this.credentialsService.credentials.permissions.all || this.credentialsService.credentials.permissions.aa.provider
    );
  }

  hasPermReviewer() {
    return Boolean(
      this.credentialsService.credentials.permissions.all || this.credentialsService.credentials.permissions.aa.reviewer
    );
  }

  loadData() {
    this.loading = true;
    this.service
      .loadAdaptationActions()
      .subscribe(
        (response) => {
          this.dataSource = new MatTableDataSource<AdaptationAction>(response);
          this.dataSource.paginator = this.paginator;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      )
      .add(() => {
        this.loading = false;
      });
  }

  addReview(uuid: string) {
    this.router.navigate([`adaptation/actions/${uuid}/reviews/new`], {
      replaceUrl: true,
    });
  }
}
