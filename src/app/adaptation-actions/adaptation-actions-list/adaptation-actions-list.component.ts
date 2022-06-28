import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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
  headers = ['id', 'name', 'adaptation_action_type', 'fms_state', 'actions'];
  loading = false;
  typesMap = adaptationsActionsTypeMap;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: AdaptationActionService, private router: Router) {}

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

  loadData() {
    this.loading = true;
    this.service.loadAdaptationActions().subscribe(
      (response) => {
        this.dataSource = new MatTableDataSource<AdaptationAction>(response);
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  addReview(uuid: string) {
    this.router.navigate([`adaptation/actions/${uuid}/reviews/new`], {
      replaceUrl: true,
    });
  }
}
