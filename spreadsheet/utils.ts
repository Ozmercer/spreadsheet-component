import * as moment from 'moment';
import { DateFormat, Value, ValueType } from '@turntown/shared';
import { SpreadsheetCell, SpreadsheetColumn, SpreadsheetColumnOptions, SpreadsheetRow } from './spreadsheet.interface';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { startCase } from 'lodash';
import {
  DeleteCellComponent,
  ErrorCellComponent,
  FooterCellComponent,
  PlaceholderCellComponent,
  ValueCellComponent,
} from './rendered-cells';
import { DateCellEditorComponent, ValueCellEditorComponent } from './cell-editors';

const deleteColumnName = 'delete';

const getData = (params, column): SpreadsheetCell =>
  column.header === deleteColumnName
    ? { error: null, value: { initial: null }, isDelete: true }
    : params.data[column.header];
const isDate = (data: SpreadsheetCell) => data.value?.valueType === ValueType.Date;

const valueGetter = (params, column: SpreadsheetColumn): Value => {
  return getData(params, column).value;
};

const valueSetter = (params, column: SpreadsheetColumn, dateFormat: DateFormat) => {
  const data = getData(params, column);

  data.error = getError(column, params.newValue, dateFormat, (params.oldValue as Value).initial);
  data.value = getNewValue(data, params.newValue, column.options, dateFormat);
  data.isNew = false;
  return true;
};

const comparator = (a: string, b: string, column: SpreadsheetColumn, dateFormat: DateFormat) => {
  const format = column.options.dateFormat ?? dateFormat;
  switch (column.options.dataType) {
    case ValueType.Date:
      return +getFormattedDate(a, format) - +getFormattedDate(b, format);
    case ValueType.Number:
      return +a - +b;
    default:
      return a?.localeCompare(b);
  }
};

const cellClassRules = (column: SpreadsheetColumn) => ({
  invalid: params => !!getData(params, column).error,
  delete: params => getData(params, column).isDelete,
  disabled: params => getData(params, column).isFooter || getData(params, column).isDelete,
});

const cellRendererSelector = (params: ICellRendererParams, column: SpreadsheetColumn, deleteIcon: string) => {
  const data = getData(params, column);

  if (params.node.rowPinned) {
    return {
      component: 'FooterCellComponent',
      params: { override: column.options.footerOverride },
    };
  }

  if (data.isDelete) {
    return {
      component: 'DeleteCellComponent',
      params: { icon: deleteIcon },
    };
  }

  if (data.error) {
    return {
      component: 'ErrorCellComponent',
      params: { tooltip: data.error },
    };
  }

  if (data.isNew) {
    return {
      component: 'PlaceholderCellComponent',
      params: { placeholder: column.header },
    };
  }

  return {
    component: 'ValueCellComponent',
    params: {
      prefix: data.options?.prefix || column.options.prefix,
      suffix: data.options?.suffix || column.options.suffix,
    },
  };
};

const frameworkComponents = {
  DateCellEditorComponent: DateCellEditorComponent,
  ValueCellComponent: ValueCellComponent,
  ValueCellEditorComponent: ValueCellEditorComponent,
  DeleteCellComponent: DeleteCellComponent,
  ErrorCellComponent: ErrorCellComponent,
  FooterCellComponent: FooterCellComponent,
  PlaceholderCellComponent: PlaceholderCellComponent,
};

function cellEditorSelector(options) {
  return { component: options.dataType === ValueType.Date ? 'DateCellEditorComponent' : 'ValueCellEditorComponent' };
}

function cellEditorParams(options, value) {
  return options.dataType === ValueType.Date ? { value: value } : undefined;
}

function getError(column: SpreadsheetColumn, value, dateFormat?: DateFormat, oldValue?): string {
  const options = column.options;
  const max = options?.max;
  const min = options?.min;
  const isString = !options.dataType || options.dataType === ValueType.Text;
  const isNumber = [ValueType.Number, ValueType.Currency].includes(options.dataType);
  const isTypeDate = options.dataType === ValueType.Date;

  const maxError = Number.isFinite(max) && max < (isString ? value?.length : +value);
  const minError = Number.isFinite(min) && min >= +value;
  const invalidRequired = options.required && !value?.toString().trim();
  const invalidDate =
    options.required && isTypeDate && Number.isNaN(getFormattedDate(value, options.dateFormat ?? dateFormat).getDate());
  const numberError = isNumber && Number.isNaN(+value);
  const forbidden = options.forbiddenValues?.includes(value);
  const customError = options.customError?.(value, oldValue);

  if (invalidRequired) {
    return getErrorString.required(column.header);
  }

  if (numberError) {
    return getErrorString.numberError;
  }

  if (maxError) {
    return isString ? getErrorString.tooLong(max) : getErrorString.tooBig(max);
  }

  if (minError) {
    return getErrorString.tooSmall(min);
  }

  if (invalidDate) {
    return getErrorString.invalidDate;
  }

  if (forbidden) {
    return getErrorString.forbidden(value);
  }

  if (customError) {
    return customError;
  }

  return null;
}

const getErrorString = {
  required: (field: string) => `${startCase(field)} is required`,
  invalidDate: 'Incorrect date format',
  numberError: 'Please enter a number',
  tooLong: limit => `Must be shorter than ${limit} characters`,
  tooBig: limit => `Must be less than ${limit}`,
  tooSmall: limit => `Must be greater than ${limit}`,
  forbidden: value => `${startCase(value)} is forbidden`,
};

function getFormattedDate(value, format: DateFormat) {
  return new Date(moment(value, format).valueOf());
}

function getNewValue(
  cell: SpreadsheetCell,
  newValue: string,
  options: SpreadsheetColumnOptions,
  dateFormat: DateFormat,
): Value {
  return {
    ...cell.value,
    initial:
      !cell.error && isDate(cell) ? getFormattedDate(newValue, options.dateFormat || dateFormat) : newValue?.toString().trim(),
    options: { ...cell.value.options, dateFormat: options.dateFormat },
  };
}

function flattenRow(row: SpreadsheetRow, columns: SpreadsheetColumn[], useDeleteColumn: boolean) {
  return Object.entries(row).reduce((flatRow, [header, cell]) => {
    if (useDeleteColumn && header === deleteColumnName) {
      // Skip delete-column, as it should only exist on view (should not be downloaded)
      return { ...flatRow };
    }
    const options = columns.find(col => col.header === header).options;
    const key = header + (options.required ? '*' : '');

    return {
      ...flatRow,
      [key]: options.dataType === ValueType.Date ? new Date(cell.value.initial) : cell.value.initial,
    };
  }, {});
}

const defaultColDef: ColDef = {
  autoHeight: true,
  editable: true,
  sortable: true,
  wrapText: true,
  rowDrag: false,
  suppressMovable: true,
};

export const spreadsheetUtils = {
  cellRendererSelector,
  cellEditorSelector,
  cellEditorParams,
  comparator,
  defaultColDef,
  deleteColumnName,
  flattenRow,
  frameworkComponents,
  getError,
  getErrorString,
  valueGetter,
  valueSetter,
  cellClassRules,
};
