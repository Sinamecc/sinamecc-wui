import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { FlexLayoutModule } from "@angular/flex-layout";

import { SharedModule } from "@app/shared";
import { MaterialModule } from "@app/material.module";
import { LoginRoutingModule } from "@app/login/login-routing.module";
import { LoginComponent } from "@app/login/login.component";
import { RestorePasswordComponent } from "./restore-password/restore-password.component";

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		TranslateModule,
		SharedModule,
		FlexLayoutModule,
		MaterialModule,
		LoginRoutingModule
	],
	declarations: [LoginComponent, RestorePasswordComponent]
})
export class LoginModule {}
