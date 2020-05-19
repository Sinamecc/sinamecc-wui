import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { environment } from "@env/environment";
import { Logger, AuthenticationService } from "@app/core";
import { DataSource } from "@angular/cdk/table";
import { Observable } from "rxjs/Observable";
const log = new Logger("Report");

import { ReportService, Report } from "@app/report/report.service";
import { MatPaginator, MatTableDataSource } from "@angular/material";

export class ReportDataSource extends DataSource<any> {
	constructor(private reportService: ReportService) {
		super();
	}
	connect(): Observable<Report[]> {
		return this.reportService.reports();
	}
	disconnect() {}
}
@Component({
	selector: "app-report",
	templateUrl: "./report.component.html",
	styleUrls: ["./report.component.scss"]
})
export class ReportComponent implements OnInit {
	version: string = environment.version;
	error: string;
	isLoading = false;
	dataSource: MatTableDataSource<Report>;
	displayedColumns = [
		"name",
		"last_active_version",
		"created",
		"updated",
		"versions"
	];
	fieldsToSearch: string[][] = [
		["name"],
		["last_active_version"],
		["versions"]
	];

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		private authenticationService: AuthenticationService,
		private reportService: ReportService
	) {}

	ngOnInit() {
		this.loadReportData();
	}

	loadReportData() {
		this.reportService.reports().subscribe((reports: Report[]) => {
			const reportList = reports;
			this.dataSource = new MatTableDataSource<Report>(reportList);
			this.dataSource.paginator = this.paginator;
		});
	}
}
