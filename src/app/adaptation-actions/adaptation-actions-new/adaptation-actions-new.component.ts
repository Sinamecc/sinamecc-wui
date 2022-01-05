import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";

@Component({
	selector: "app-adaptation-actions-new",
	templateUrl: "./adaptation-actions-new.component.html",
	styleUrls: ["./adaptation-actions-new.component.scss"]
})
export class AdaptationActionsNewComponent implements OnInit {
	adaptationActionForm: any = {};
	durationInSeconds = 3;

	constructor() {}

	ngOnInit() {}
}
