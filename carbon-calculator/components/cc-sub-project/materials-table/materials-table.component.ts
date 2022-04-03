import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpreadsheetCell, SpreadsheetColumn, SpreadsheetColumnConfigType, SpreadsheetRow } from '@turntown/components';
import { ValueType } from '@turntown/shared';

@Component({
  selector: 'cp-materials-table',
  templateUrl: './materials-table.component.html',
  styleUrls: ['./materials-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsTableComponent {
  columnNames = {
    type: 'Material Type',
    quantity: 'Adjusted Qty',
    material: 'Material',
    impact: 'CO2 Impact',
  };
  columns: SpreadsheetColumn[] = [
    { header: this.columnNames.type, options: { nonEditable: true } },
    {
      header: this.columnNames.quantity,
      options: { dataType: ValueType.Number, type: SpreadsheetColumnConfigType.rightAligned, required: true, min: 0 },
    },
    { header: this.columnNames.material, options: { nonEditable: true } },
    {
      header: this.columnNames.impact,
      options: {
        nonEditable: true,
        dataType: ValueType.Number,
        type: SpreadsheetColumnConfigType.rightAligned,
        suffix: 'kg CO2',
      },
    },
  ];

  // TODO: Use live data when exists
  mockData: SpreadsheetRow[] = [
    {
      [this.columnNames.type]: this.generateCell('Type 1'),
      [this.columnNames.quantity]: this.generateCell(this.randNum() * 100, ValueType.Number, 'm2'),
      [this.columnNames.material]: this.generateCell('Material 1'),
      [this.columnNames.impact]: this.generateCell(this.randNum(), ValueType.Number),
    },
    {
      [this.columnNames.type]: this.generateCell('Type 2'),
      [this.columnNames.quantity]: this.generateCell(this.randNum() * 100, ValueType.Number, 't'),
      [this.columnNames.material]: this.generateCell('Material 2'),
      [this.columnNames.impact]: this.generateCell(this.randNum(), ValueType.Number),
    },
    {
      [this.columnNames.type]: this.generateCell('Type 3'),
      [this.columnNames.quantity]: this.generateCell(null, ValueType.Number, 'm3'),
      [this.columnNames.material]: this.generateCell('Material 3'),
      [this.columnNames.impact]: this.generateCell(this.randNum(), ValueType.Number),
    },
  ];

  private randNum() {
    return Math.floor(Math.random() * 1000);
  }

  private generateCell(value, type = ValueType.Text, suffix?: string): SpreadsheetCell {
    return {
      value: {
        initial: value,
        valueType: type,
        options: {
          decimalPlaces: { max: 0, min: 0 },
        },
      },
      error: null,
      isNew: !value,
      options: { suffix },
    };
  }

  onSpreadsheetChange(x) {
    // TODO: Add logic when story is unblocked (TT-8342)
    // eslint-disable-next-line no-console
    console.log(x);
  }
}
