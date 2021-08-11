import { DataSource } from '@angular/cdk/table';
import { Groups } from '../groups';
import { Observable } from 'rxjs';
import { AdminService } from '../admin.service';

export class GroupsDataSource extends DataSource<any> {
  groups: Groups[];
  groups$: Observable<Groups[]>;

  constructor(private adminService: AdminService) {
    super();
  }

  connect(): Observable<Groups[]> {
    this.groups$ = this.adminService.groups();
    this.groups$.subscribe((groups) => {
      this.groups = groups;
    });
    return this.groups$;
  }
  disconnect() {}
}
