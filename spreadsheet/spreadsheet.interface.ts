import { DateFormat, Value, ValueType } from '@turntown/shared';

export interface SpreadsheetColumn {
  header: string;
  options: SpreadsheetColumnOptions;
}

export enum NewRowPosition {
  Top = 'top',
  Bottom = 'bottom',
}

export interface SpreadsheetColumnOptions {
  /** Defines if a numeric value will be abbreviated (100k instead of 100000). Behaves as true by default */
  abbreviated?: boolean;

  /** Enter a function that will be called after any cell in the column is changed. Updated params object
   * is called as an argument. */
  onChangeCallback?: (value: string) => void;

  /** Defines the currency symbol for values of type Currency. Dy default set to 'GBP'. */
  currencyCode?: string;

  /** Dy default set to 'ValueType.Text'. */
  dataType?: ValueType;

  /** Override default date-format which is set by user preferences. Only works for dataType === Date. */
  dateFormat?: DateFormat;

  /**
   * A string that will be shown in the footer regardless of the above values. Best used as `Total:` in the first column.
   * Footer column is activated when [useTotalsRow]="true" in html.
   */
  footerOverride?: string;

  headerTooltip?: string;

  /** Defines if a newly added row will be positioned at the top or the bottom of the table. By default set to 'top'. */
  newRowPosition?: NewRowPosition;

  /**
   * Throws error if cell value-string length is longer than max (For dataType === String) or value is larger than max
   * (for dataTypes Number or Currency).
   */
  max?: number;

  /** Throws error if cell value is less than min (for dataTypes Number or Currency). */
  min?: number;

  /** Makes column non editable. */
  nonEditable?: boolean;

  /** A string to be added to the start of each cell in the column. Is overridden by SpreadsheetCell options */
  prefix?: string,

  /** Throws error if cell is empty. */
  required?: boolean;

  /** Sets main sort. Should only apply to a single field - Only first instance will be used. */
  sort?: 'desc' | 'asc';

  /** Sets secondary sort. Should only apply to a single field - Only first instance will be used. */
  sortSecondary?: 'desc' | 'asc';

  /** A string to be added to the end of each cell in the column. Is overridden by SpreadsheetCell options */
  suffix?: string,

  /** Prevents sorting of column. */
  suppressSort?: boolean,

  /** Manually set column header on the grid. This will not affect the title when table is downloaded to Excel. */
  titleOverride?: string,

  /** Default styling by AG Grid. Use as one or more values from SpreadsheetColumnConfigType. */
  type?: SpreadsheetColumnConfigType | SpreadsheetColumnConfigType[];

  /** Column width. */
  width?: number;

  /** Throws an error if user enters any value in this array into a cell of this column. Case-sensitive. */
  forbiddenValues?: string[];

  /** Hide column */
  hide?: boolean;

  /** Callback function that returns a string. This string will be shown as an error */
  customError?: (value: string, oldValue: string) => string;
}

export interface SpreadsheetCell {
  value: Value;
  error?: string;
  isNew?: boolean;
  isFooter?: boolean;
  isDelete?: boolean;
  options?: {
    // Prefix and Suffix will appear before/after value in cells. Overrides column-level prefix/suffix.
    prefix?: string;
    suffix?: string;
  };
}

export interface SpreadsheetRow {
  [key: string]: SpreadsheetCell;
}

export enum SpreadsheetColumnConfigType {
  rightAligned = 'rightAligned',
  nonEditableColumn = 'nonEditableColumn',
  dateColumn = 'dateColumn',
  numericColumn = 'numericColumn',
}

export enum SpreadsheetFilter {
  All = 'all',
  Valid = 'valid',
  Invalid = 'invalid',
}

