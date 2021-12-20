import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { TranslateModule } from "@ngx-translate/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "@app/material.module";

import { environment } from "@env/environment";
import { CoreModule } from "@app/core";
import { SharedModule } from "@app/shared";
/*import { HomeModule } from '@app/home/home.module';*/
import { ReportModule } from "@app/report/report.module";
import { MitigationActionsModule } from "@app/mitigation-actions/mitigation-actions.module";
import { LoginModule } from "@app/login/login.module";
import { AppComponent } from "@app/app.component";
import { AppRoutingModule } from "@app/app-routing.module";
import { MccrRegistriesModule } from "@app/mccr/mccr-registries/mccr-registries.module";
import { PpcnModule } from "@app/ppcn/ppcn.module";
import { MccrPocModule } from "@app/mccr/mccr-poc/mccr-poc.module";
import { AdminModule } from "./admin/admin.module";
import { ErrorComponent } from "./error/error.component";
import { HomeModule } from "./home/home.module";
import { AdaptationActionsModule } from "./adaptation-actions/adaptation-actions.module";

@NgModule({
	imports: [
		BrowserModule,
		ServiceWorkerModule.register("/ngsw-worker.js", {
			enabled: environment.production
		}),
		FormsModule,
		HttpClientModule,
		TranslateModule.forRoot(),
		BrowserAnimationsModule,
		MaterialModule,
		CoreModule,
		SharedModule,
		HomeModule,
		ReportModule,
		AdminModule,
		MitigationActionsModule,
		MccrRegistriesModule,
		MccrPocModule,
		PpcnModule,
		AdaptationActionsModule,
		LoginModule,
		AppRoutingModule
	],
	declarations: [AppComponent, ErrorComponent],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
