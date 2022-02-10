import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { extract, Route } from "@app/core";
import { AdaptationActionsListComponent } from "./adaptation-actions-list/adaptation-actions-list.component";
import { AdaptationActionsNewComponent } from "./adaptation-actions-new/adaptation-actions-new.component";

const routes: Routes = [
	Route.withShell([
		{ path: "", redirectTo: "adaptation/actions", pathMatch: "full" },
		{
			path: "adaptation/actions",
			component: AdaptationActionsListComponent,
			data: { title: extract("Nueva acción de adaptación") }
		},
		{
			path: "adaptation/actions/new",
			component: AdaptationActionsNewComponent,
			data: { title: extract("Nueva acción de adaptación") }
		}
	])
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdaptationActionsRoutingModule {}
