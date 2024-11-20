import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-custom-search-bar',
  templateUrl: './custom-search-bar.component.html',
  styleUrls: ['./custom-search-bar.component.scss'],
})
export class CustomSearchBarComponent implements OnInit {
  @Input() table: MatTableDataSource<any>;
  initialDataSource: any[];

  @Input() fieldsToSearch: string[][];

  constructor() {}

  ngOnInit(): void {}

  applyFilter(text: string) {
    if (!this.initialDataSource) {
      this.initialDataSource = this.table.data;
    }

    this.table.data = this.initialDataSource;
    let newArray: any[] = [];

    if (!text) {
      newArray = this.initialDataSource;
    } else {
      const tempFieldToSearch = this.fieldsToSearch;
      this.table.data.forEach(function (value: any) {
        for (const element of tempFieldToSearch) {
          let actualArray = value;
          for (const object of element) {
            actualArray = actualArray[object];
          }
          const objToSearch = actualArray.toString().trim().toLowerCase();
          if (objToSearch.includes(text.trim().toLowerCase())) {
            newArray.push(value);
            break;
          }
        }
      });
    }
    this.table.data = newArray;
  }
}
