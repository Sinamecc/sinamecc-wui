import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';
import { adaptationsActionsTypeMap } from '../interfaces/catalogs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PermissionService } from '@app/@core/permissions.service';
import { States } from '@app/@shared/next-state';
import { MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-adaptation-actions-list',
  templateUrl: './adaptation-actions-list.component.html',
  styleUrls: ['./adaptation-actions-list.component.scss'],
  standalone: false,
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
    public permissions: PermissionService,
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

  canEdit(state: States): boolean {
    return this.permissions.canEditAA(state) || this.permissions.canEditAcceptedAA(state);
  }

  canDelete(state: States): boolean {
    return this.permissions.canDeleteAA(state);
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
        },
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
