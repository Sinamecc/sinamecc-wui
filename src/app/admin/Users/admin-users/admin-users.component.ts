import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../../users";
import { Role } from "../../roles";
import { AdminService } from "../../admin.service";
import {
	MatPaginator,
	MatDialog,
	MatDialogConfig,
	MatTableDataSource
} from "@angular/material";
import { ComponentDialogComponent } from "@app/core/component-dialog/component-dialog.component";
import { AdminUserDetailComponent } from "../admin-user-detail/admin-user-detail.component";
import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs/Observable";

export class UsersDataSource extends DataSource<any> {
	users: User[];
	users$: Observable<User[]>;

	constructor(private adminService: AdminService) {
		super();
	}

	connect(): Observable<User[]> {
		this.users$ = this.adminService.users();
		this.users$.subscribe(ppcns => {
			this.users = ppcns;
		});
		return this.users$;
	}
	disconnect() {}
}

@Component({
	selector: "app-admin-users",
	templateUrl: "./admin-users.component.html",
	styleUrls: ["./admin-users.component.scss"]
})
export class AdminUsersComponent implements OnInit {
	displayedColumns = ["username", "email", "roles", "action"];
	dataSource: MatTableDataSource<User>;
	fieldsToSearch: string[][] = [["username"], ["email"], ["roles"]];
	roles: Role[];
	roles$: Observable<Role[]>;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private adminService: AdminService, public dialog: MatDialog) {}

	ngOnInit() {
		this.loadUsers();
	}

	openDeleteConfirmationDialog() {
		const data = {
			title: "admin.deleteUser",
			question: "general.youSure"
		};
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = data;
		dialogConfig.width = "350px";
		const dialogRef = this.dialog.open(ComponentDialogComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
			}
		});
	}

	openUserDetail(user: string) {
		const dialogRef = this.dialog.open(AdminUserDetailComponent, {
			width: "70%",
			height: "90%",
			data: {
				user: user
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			this.loadUsers();
		});
	}

	loadUsers() {
		this.adminService.users().subscribe((users: User[]) => {
			const usersList = users;
			usersList.forEach((user: User) => {
				user["joinedRoles"] = user.roles
					.map((role: any) => role.role_name)
					.join(", ");
			});
			this.dataSource = new MatTableDataSource<User>(usersList);
			this.dataSource.paginator = this.paginator;
		});
	}
}
