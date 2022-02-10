import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { AdaptationActionService } from "../adaptation-actions-service";
import { AdaptationAction } from "../interfaces/adaptationAction";
import { adaptationsActionsTypeMap } from "../interfaces/catalogs";

@Component({
	selector: "app-adaptation-actions-list",
	templateUrl: "./adaptation-actions-list.component.html",
	styleUrls: ["./adaptation-actions-list.component.scss"]
})
export class AdaptationActionsListComponent implements OnInit {
	adaptationsActions: AdaptationAction[] = [];
	dataSource: MatTableDataSource<AdaptationAction>;
	headers = ["id", "name", "adaptation_action_type", "fms_state", "actions"];
	loading = false;
	typesMap = adaptationsActionsTypeMap;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private service: AdaptationActionService) {}

	ngOnInit() {
		this.loadData();
	}

	loadData() {
		this.loading = true;
		this.service.loadAdaptationActions().subscribe(
			response => {
				this.dataSource = new MatTableDataSource<AdaptationAction>(response);
				this.dataSource.paginator = this.paginator;
				this.loading = false;
			},
			error => {
				this.loading = false;
			}
		);
	}
}
