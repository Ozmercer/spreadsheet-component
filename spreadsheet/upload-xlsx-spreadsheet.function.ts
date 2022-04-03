import { isEqual } from 'lodash';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { ErrorMessage, SuccessMessage, uploadXlsx, Value, ValueType } from '@turntown/shared';
import {
  SpreadsheetColumn,
  SpreadsheetColumnOptions,
  SpreadsheetRow,
} from './spreadsheet.interface';
import * as moment from 'moment';
import { spreadsheetUtils } from './utils';
import { first } from 'rxjs/operators';

export function uploadExcelSpreadsheet(event, templateColumns: SpreadsheetColumn[], store: Store) {
  const fileName = event.target.files[0].name;
  const dataObserver: BehaviorSubject<SpreadsheetRow[]> = new BehaviorSubject<SpreadsheetRow[]>([]);

  uploadXlsx(event).pipe(first()).subscribe(data => {
    const columns = [];
    const importedData: SpreadsheetRow[] = data
      .map((row, index) => {
        if (index === 0) {
          row.forEach(header => columns.push(header.replace('*', '')));
        } else {
          const rowObject: SpreadsheetRow = {};
          templateColumns.forEach((column, j) => rowObject[column.header] = {
            value: getValue(row[j], column.options),
            error: getError(column, row[j]),
          });
          return rowObject;
        }
      })
      .filter(Boolean);

    if (isEqual(columns, templateColumns.map(col => col.header))) {
      dataObserver.next(importedData);
      store.dispatch(
        new SuccessMessage({ data: { message: 'The Document Register has been successfully uploaded.' } }),
      );
    } else {
      const message = 'Column headers are invalid. Please make sure the upload matches the template.';
      store.dispatch(new ErrorMessage({ data: { message } }));
    }
  });
  return { data: dataObserver, fileName, lastUpdated: new Date() };
}

export function getError(column: SpreadsheetColumn, value: any): string {
  const isDate = column.options.dataType === ValueType.Date;
  const options = column.options;
  const invalidDate = options.required && isDate && isInvalidDate(value);

  if (invalidDate) {
    return spreadsheetUtils.getErrorString.invalidDate;
  }

  return spreadsheetUtils.getError(column, value);
}

function isInvalidDate(value) {
  return typeof value === 'string' || Number.isNaN(new Date(moment(value).valueOf()).getDate());
}

const getValue = (value: string, options: SpreadsheetColumnOptions): Value => {
  const isDate = options.dataType === ValueType.Date;
  const initial = isDate && value && !isInvalidDate(value) ? new Date(Date.UTC(0, 0, +value - 1)) : value ?? '';

  return {
    initial,
    valueType: isDate ? ValueType.Date : ValueType.Text,
    options: { dateFormat: options.dateFormat },
  };
};
