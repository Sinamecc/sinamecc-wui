import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { AdminService } from '../admin.service';
import { Permissions } from '@app/core/permissions';

export class PermissionsDataSource extends DataSource<any> {

    permissions: Permissions[];
    permissions$: Observable<Permissions[]>;

    constructor(private adminService: AdminService) {
      super();
    }

    connect(): Observable<Permissions[]> {
      this.permissions$ = this.adminService.permissions();
      this.permissions$.subscribe((permissions) => {
        this.permissions = permissions;
      });
      return this.permissions$;
    }
    disconnect() { }

  }

