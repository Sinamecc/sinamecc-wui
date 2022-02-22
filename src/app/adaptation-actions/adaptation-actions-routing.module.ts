import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { extract, Route } from "@app/core";
import { AdaptationActionsListComponent } from "./adaptation-actions-list/adaptation-actions-list.component";
import { AdaptationActionsNewComponent } from "./adaptation-actions-new/adaptation-actions-new.component";
import { AdaptationActionsViewComponent } from "./adaptation-actions-view/adaptation-actions-view.component";

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
			data: { title: extract("Lista de acciones de adaptación") }
		},
		{
			path: "adaptation/actions/:id",
			component: AdaptationActionsViewComponent,
			data: { id: extract("id") }
		}
	])
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdaptationActionsRoutingModule {}
