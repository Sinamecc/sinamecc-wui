import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { ViewPdfService } from "./view-pdf.service";

@Component({
	selector: "app-view-pdf",
	templateUrl: "./view-pdf.component.html",
	styleUrls: ["./view-pdf.component.scss"]
})
export class ViewPdfComponent implements OnInit {
	isLoading = true;
	documentURl: string;
	documentID: string;
	document: any;

	constructor(
		private service: ViewPdfService,
		private route: ActivatedRoute,
		private sanitizer: DomSanitizer
	) {}

	ngOnInit() {
		this.documentID = this.route.snapshot.paramMap.get("id");
		const mopduleID = this.route.snapshot.paramMap.get("moduleID")
		this.documentURl = this.route.routeConfig.path.includes("ppcn")
			? `/api/v1/ppcn/${mopduleID}/ppcn_file/${this.documentID}`
			: "";
		this.download(this.documentURl);
	}

	async download(file: string) {
		if(file){
			this.isLoading = true;
			const blob = await this.service.downloadResource(file);
	
			const blobPDF = new Blob([blob.data], { type: "application/pdf" });
			this.document = this.sanitizer.bypassSecurityTrustResourceUrl(
				URL.createObjectURL(blobPDF)
			);
	
			this.isLoading = false;
		}
	}
}
