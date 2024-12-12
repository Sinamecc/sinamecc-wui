import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gas-report-table',
  templateUrl: './gas-report-table.component.html',
  styleUrls: ['./gas-report-table.component.scss'],
  standalone: false,
})
export class GasReportTableComponent implements OnInit {
  @Input() editForm = false;
  @Input() editData: Object;

  inventaryResultTable = {
    firstSection: {
      tableHeaderValues: [
        'ppcn.gasesReport',
        'general.total',
        'CO<sub>2</sub>',
        'CH<sub>4</sub>',
        'N<sub>2</sub>O',
        'PFC',
        'HFC',
        'SF<sub>6</sub>',
        'NF<sub>3</sub>',
        'HCFC',
        'CFC',
        'ppcn.otherGases',
      ],
      tableRows: [
        [
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
        ],
        [
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
        ],
        [
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
          { value: '0' },
        ],
      ],
    },
    secondSection: {
      firsRow: ['ppcn.reportOtherGases', ''],
    },
    thirdSection: {
      firsRow: ['ppcn.biogenicEmissions', 'Total', '0'],
      secondRow: ['general.scope', ''],
      thirdSection: ['general.scope', ''],
    },
    fourthSection: {
      firsRow: ['ppcn.costGHG', '0', 'general.currency', 'CRC'],
      secondRow: ['ppcn.verificationOVV', '0', 'general.currency', 'CRC'],
    },
  };

  categoryTable = {
    category: ['ppcn.organitationCategoryPpcn', ''],
    categoryHeader: ['ppcn.amountEmissions', 'ppcn.numberFacilities', 'ppcn.amountGHG', 'ppcn.complexityMethodologies'],
    categoryRow: [
      { value: '0', type: 'number' },
      { value: '0', type: 'number' },
      { value: '0', type: 'number' },
      { value: '', type: 'text' },
    ],
  };

  constructor() {}

  ngOnInit() {
    if (this.editData) {
      if (this.editData['gei_organization']) {
        this.setInventaryResultTableValues(this.editData['gei_organization']['gas_report']);
        this.setCategoryTableValues(this.editData['gei_organization']['organization_category']);
      }
    }
  }

  changeMatrixValues(row: number, column: number, value: string) {
    this.inventaryResultTable.firstSection.tableRows[row][column].value = value;
  }

  changeTableValue(section: string, row: string, column: number, value: string) {
    this.inventaryResultTable[section][row][column] = value;
  }

  getTableValue(section: string, row: string, column: number) {
    return this.inventaryResultTable[section][row][column];
  }

  getCategoryTableValue(row: string, column: string | number) {
    return this.categoryTable[row][column];
  }

  changeCategoryTableValue(row: string, column: string | number, value: string, object: boolean = false) {
    if (object) {
      this.categoryTable[row][column].value = value;
    } else {
      this.categoryTable[row][column] = value;
    }
  }

  buildTableSection() {
    const gasReport = {};
    const biogenic_emission = {};

    gasReport['other_gases'] = this.inventaryResultTable.secondSection.firsRow[1];

    biogenic_emission['total'] = this.inventaryResultTable.thirdSection.firsRow[2];
    biogenic_emission['scope_1'] = this.inventaryResultTable.thirdSection.secondRow[1];
    biogenic_emission['scope_2'] = this.inventaryResultTable.thirdSection.thirdSection[1];

    gasReport['biogenic_emission'] = biogenic_emission;

    gasReport['cost_ghg_inventory'] = this.inventaryResultTable.fourthSection.firsRow[1];
    gasReport['cost_ghg_inventory_currency'] = this.inventaryResultTable.fourthSection.firsRow[3];
    gasReport['cost_ovv_process'] = this.inventaryResultTable.fourthSection.secondRow[1];
    gasReport['cost_ovv_process_currency'] = this.inventaryResultTable.fourthSection.secondRow[3];

    gasReport['gas_scopes'] = this.buildScopeMatrixTable();

    return gasReport;
  }

  buildCategoryTableSection() {
    const organizationCategory = {};
    organizationCategory['organization_category'] = this.categoryTable.category[1];
    organizationCategory['emission_quantity'] = this.categoryTable.categoryRow[0].value;
    organizationCategory['buildings_number'] = this.categoryTable.categoryRow[1].value;
    organizationCategory['data_inventory_quantity'] = this.categoryTable.categoryRow[2].value;
    organizationCategory['methodologies_complexity'] = this.categoryTable.categoryRow[3].value;

    return organizationCategory;
  }

  buildScopeMatrixTable() {
    const gasScopes = [];
    let i = 0;
    for (const row of this.inventaryResultTable.firstSection.tableRows) {
      let j = 0;
      const scope = {};
      const quantifiedGases = [];
      scope['name'] = `scope_${i + 1}`;
      for (const column of row) {
        const gas = {
          name: this.inventaryResultTable.firstSection.tableHeaderValues[j].replace('<sub>', '').replace('</sub>', ''),
          value: column.value,
        };
        j += 1;
        quantifiedGases.push(gas);
      }
      scope['quantified_gases'] = quantifiedGases;
      gasScopes.push(scope);
      i += 1;
    }

    return gasScopes;
  }

  setInventaryResultTableValues(data: any) {
    // set third section data
    this.inventaryResultTable.thirdSection.firsRow[2] = data['biogenic_emission'].total;
    this.inventaryResultTable.thirdSection.secondRow[1] = data['biogenic_emission'].scope_1;
    this.inventaryResultTable.thirdSection.thirdSection[1] = data['biogenic_emission'].scope_2;

    // set fourth section data
    this.inventaryResultTable.fourthSection.firsRow[1] = data['cost_ghg_inventory'];
    this.inventaryResultTable.fourthSection.firsRow[3] = data['cost_ghg_inventory_currency'];
    this.inventaryResultTable.fourthSection.secondRow[1] = data['cost_ovv_process'];
    this.inventaryResultTable.fourthSection.secondRow[3] = data['cost_ovv_process_currency'];

    // set second section data

    this.inventaryResultTable.secondSection.firsRow[1] = data['other_gases'];

    // set first section data
    let indexRow = 0;
    for (const row of data['gas_scopes']) {
      let indexColumn = 0;
      for (const column of row['quantified_gases']) {
        this.inventaryResultTable.firstSection.tableRows[indexRow][indexColumn].value = Number(column.value).toString();
        indexColumn += 1;
      }
      indexRow += 1;
    }
  }

  setCategoryTableValues(data: any) {
    this.categoryTable.category[1] = data['organization_category'];
    this.categoryTable.categoryRow[0].value = data['emission_quantity'];
    this.categoryTable.categoryRow[1].value = data['buildings_number'];
    this.categoryTable.categoryRow[2].value = data['data_inventory_quantity'];
    this.categoryTable.categoryRow[3].value = data['methodologies_complexity'];
  }
}
