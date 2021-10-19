import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-mitigation-action-info-modal",
	templateUrl: "./mitigation-action-info-modal.component.html",
	styleUrls: ["./mitigation-action-info-modal.component.scss"]
})
export class MitigationActionInfoModalComponent implements OnInit {
	externalURL = // TODO : Define if this is the correct URL for put it in a const
		"https://www.ghgprotocol.org/sites/default/files/ghgp/standards/Spanish%20-%20Policy%20and%20Action%20Standard.pdf";

	constructor() {}

	ngOnInit() {}
}
