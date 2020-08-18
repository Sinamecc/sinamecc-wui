import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { extract } from "@app/core";
import { LoginComponent } from "@app/login/login.component";
import { RestorePasswordComponent } from "./restore-password/restore-password.component";

const routes: Routes = [
	{
		path: "login",
		component: LoginComponent,
		data: { title: extract("Login") }
	},
	{
		path: "changePassword",
		component: RestorePasswordComponent,
		data: { title: extract("Change password") }
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: []
})
export class LoginRoutingModule {}
