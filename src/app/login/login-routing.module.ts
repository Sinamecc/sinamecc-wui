import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { extract } from "@app/core";
import { LoginComponent } from "@app/login/login.component";
import { CreateUserComponent } from "./create-user/create-user.component";

const routes: Routes = [
	{
		path: "login",
		component: LoginComponent,
		data: { title: extract("Login") }
	},
	{
		path: "signup",
		component: CreateUserComponent,
		data: { title: extract("Sign up") }
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: []
})
export class LoginRoutingModule {}
