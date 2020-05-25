import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { Route, extract } from "@app/core";

import { AdminPermissionsComponent } from "./Permissions/admin-permissions/admin-permissions.component";
import { AdminPermissionsNewComponent } from "./Permissions/admin-permissions-new/admin-permissions-new.component";
import { AdminGroupsComponent } from "./Groups/admin-groups/admin-groups.component";
import { AdminGroupsNewComponent } from "./Groups/admin-groups-new/admin-groups-new.component";
import { AdminNewComponent } from "./Users/admin-new/admin-new.component";
import { AdminUsersComponent } from "./Users/admin-users/admin-users.component";

const routes: Routes = [
	Route.withShell([
		{ path: "", redirectTo: "admin", pathMatch: "full" },
		{
			path: "admin/users/new",
			component: AdminNewComponent,
			data: { title: extract("admin.createUser") }
		},
		{
			path: "admin/users",
			component: AdminUsersComponent,
			data: { title: extract("admin.users") }
		},
		{
			path: "admin/permissions",
			component: AdminPermissionsComponent,
			data: { title: extract("admin.permissions") }
		},
		{
			path: "admin/permissions/new",
			component: AdminPermissionsNewComponent,
			data: { title: extract("admin.createPerm") }
		},
		{
			path: "admin/groups",
			component: AdminGroupsComponent,
			data: { title: extract("admin.groups") }
		},
		{
			path: "admin/groups/new",
			component: AdminGroupsNewComponent,
			data: { title: extract("admin.createGroup") }
		}
	])
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: []
})
export class AdminRoutingModule {}
