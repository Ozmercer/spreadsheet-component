import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, RowNode } from 'ag-grid-community';
import {
  NewRowPosition,
  SpreadsheetCell,
  SpreadsheetColumn,
  SpreadsheetColumnOptions,
  SpreadsheetFilter,
  SpreadsheetRow,
} from './spreadsheet.interface';
import { BreakpointService, DateFormat, downloadXlsx, PreferencesSelectors, Value, ValueType } from '@turntown/shared';
import { Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { cloneDeep, isEqual } from 'lodash';
import { spreadsheetUtils as utils } from './utils';
import { MatRadioGroup } from '@angular/material/radio';

interface DeletedRowData {
  oldRowArray: SpreadsheetRow[];
  deletedRow: SpreadsheetRow[];
}

@Component({
  selector: 'tt-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styleUrls: ['./spreadsheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpreadsheetComponent implements OnInit, OnDestroy, AfterViewInit {
  // 'useDeleteColumn' and 'useTotalsRow' inputs must be defined first on the html for them to work correctly
  // TODO: Solve order issue
  @Input() useDeleteColumn: boolean;
  @Input() useTotalsRow: boolean;
  @Input() fileName: string;
  @Input() newRowPosition = NewRowPosition.Top;
  @Input() hideFilters = false;
  @Input() addBtnText = 'Add Row';
  // 'deleteIcon' must match MatIcon syntax
  @Input() deleteIcon = 'delete';
  @Input() onDeleteCallback: (rows?: SpreadsheetRow[], deletedRow?: SpreadsheetRow) => Promise<boolean> = null;
  @Output() editedStateChanged = new EventEmitter<boolean>();
  @Output() changed = new EventEmitter<SpreadsheetRow[]>();
  @Output() removed = new EventEmitter<DeletedRowData>();

  @Input() set dataSource(data: SpreadsheetRow[]) {
    const addDeleteColumn = (row: SpreadsheetRow): SpreadsheetRow => ({
      ...row,
      delete: { error: null, value: { initial: null, valueType: null }, isDelete: true },
    });
    if (data) {
      this.data = cloneDeep(data).map(row => this.useDeleteColumn ? addDeleteColumn(row) : row);
      this.checkValidity(data);
    }
    setTimeout(() => this.setTotalsRow());
  };

  @Input() set columns(cols: SpreadsheetColumn[]) {
    if (cols) {
      this._columns = cloneDeep(cols);
      if (this.useDeleteColumn) {
        this._columns.push({
          header: this.deleteColumnName,
          options: { width: 80, titleOverride: '', footerOverride: '', nonEditable: true, suppressSort: true },
        });
      }
      this.columnDefs = this._columns.map(column => this.getColumnDef(column));
    }
  };

  @Input() set isSaved(value: boolean) {
    this._isSaved = value;
    this.checkValidity(this.data);
  }

  @Input() set originalData(value: SpreadsheetRow[]) {
    this._originalData = value;
    this.checkValidity(value);
  }

  @ViewChild(AgGridAngular, { static: false }) grid: AgGridAngular;
  @ViewChild(MatRadioGroup, { static: false }) radioGroup: MatRadioGroup;

  get columns() {
    return this._columns;
  }

  get isSaved(): boolean {
    return this._isSaved;
  }

  get originalData(): SpreadsheetRow[] {
    return this._originalData;
  }

  columnDefs: ColDef[] = [];
  data: SpreadsheetRow[];
  dateFormat = DateFormat.DMY;
  dateFormat$ = this.store.select(PreferencesSelectors.dateFormat);
  defaultColDef = utils.defaultColDef;
  filter = SpreadsheetFilter.All;
  filterTypes = SpreadsheetFilter;
  frameworkComponents = utils.frameworkComponents;
  hasInvalidCells = true;
  invalid = true;
  isDesktop = true;
  isUnchanged = true;
  pinnedBottomRowData: SpreadsheetRow[] = [];
  stopEditOnBlur = true;
  rowPosition = NewRowPosition;
  oldDataArray: SpreadsheetRow[] = [];
  private _columns: SpreadsheetColumn[];
  private _isSaved: boolean;
  private _originalData: SpreadsheetRow[];
  private readonly deleteColumnName = utils.deleteColumnName;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(private store: Store, private breakpointService: BreakpointService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.dateFormat$.pipe(takeUntil(this.unsubscribe$)).subscribe((format) => {
      this.dateFormat = format;
      this.grid?.api.refreshCells();
    });

    this.breakpointService.isDesktop$.pipe(takeUntil(this.unsubscribe$)).subscribe(isDesktop => this.isDesktop = isDesktop);
  }

  ngAfterViewInit() {
    if (this.isDesktop) {
      this.grid.api?.sizeColumnsToFit();
    }
    this.grid.api.resetRowHeights();
    this.checkValidity(this.grid.rowData);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getColumnDef(column: SpreadsheetColumn): ColDef {
    const options = column.options;
    const headerName = column.header;
    const getData = (params): SpreadsheetCell => column.header === this.deleteColumnName
      ? { error: false, value: { initial: null }, isDelete: true }
      : params.data[headerName];

    const def: ColDef = {
      cellClassRules: utils.cellClassRules(column),
      cellEditorParams: params => utils.cellEditorParams(options, getData(params).value),
      cellEditorSelector: () => utils.cellEditorSelector(options),
      cellRendererSelector: params => utils.cellRendererSelector(params, column, this.deleteIcon),
      comparator: (a: string, b: string) => utils.comparator(a, b, column, this.dateFormat),
      editable: params => !options.nonEditable && !getData(params).isFooter,
      headerName: options.titleOverride ?? headerName,
      onCellClicked: event => this.onCellClicked(getData(event), event, options),
      onCellValueChanged: params => options.onChangeCallback?.(params),
      sortable: !options.suppressSort,
      valueGetter: params => utils.valueGetter(params, column),
      valueSetter: params => utils.valueSetter(params, column, this.dateFormat),
    };

    def.width = options.width;
    def.type = options.type;
    def.sort = options.sort;
    def.headerTooltip = options.headerTooltip;
    def.hide = options.hide;

    return def;
  }

  isNumeric = (type: ValueType): boolean => type === ValueType.Currency || type === ValueType.Number;

  async onCellClicked(data: SpreadsheetCell, event, options: SpreadsheetColumnOptions) {
    this.oldDataArray = [...this.data];
    if (data.isDelete && !data.isFooter) {
      // Allows using modals before delete
      if (!this.onDeleteCallback || await this.onDeleteCallback(this.data, event.data)) {
        this.grid.api.applyTransaction({ remove: [event.node.data] });
        const rowsCount = this.grid.api.getDisplayedRowCount();
        const updatedData = [];
        Array(rowsCount).fill(null).forEach((_, i) => updatedData.push(this.grid.api.getDisplayedRowAtIndex(i).data));

        this.data = updatedData;
        this.grid.api.setRowData(updatedData);
        this.getDeletedRow();
        this.gridChanged(this.data);
      }
    }
    this.stopEditOnBlur = options.dataType !== ValueType.Date;
    this.cdr.detectChanges();
  }

  getDeletedRow() {
    if (this.oldDataArray.length === this.data.length) {
      return;
    }
    const deletedRow = this.oldDataArray.filter(x => !this.data.includes(x));
    this.setTotalsRow();
    this.removed.emit({ oldRowArray: this.oldDataArray, deletedRow: deletedRow });
  }

  externalFilterChanged(value: SpreadsheetFilter) {
    this.filter = value;
    this.grid.api.onFilterChanged();
  }

  gridChanged(rows?: SpreadsheetRow[]) {
    this.checkValidity(rows ?? this.grid.rowData);
    this.grid.api.onFilterChanged();
    this.grid.api.resetRowHeights();
    this.setTotalsRow();
    this.changed.emit(this.data);
  }

  setTotalsRow() {
    if (!this.useTotalsRow || !this.data?.length) {
      return;
    }
    const sumCol = (header: string) => this.data.reduce((sum, row) => sum + +row[header]?.value.initial, 0);
    const getValue = (col: SpreadsheetColumn): Value => ({
      initial: col.options.footerOverride ?? this.isNumeric(col.options.dataType) ? sumCol(col.header) : null,
      valueType: col.options.dataType ?? ValueType.Text,
      options: {
        ...this.data[0][col.header].value.options,
        naString: '',
      },
    });
    const totalsRow: SpreadsheetRow = this.columns.reduce((row, col) => ({
      ...row,
      [col.header]: {
        value: getValue(col),
        isFooter: true,
        isDelete: false,
      },
    }), {});
    this.grid.api.setPinnedBottomRowData([totalsRow]);
  }

  removeFilters() {
    this.radioGroup.value = this.filterTypes.All;
    this.externalFilterChanged(this.filterTypes.All);
  }

  checkValidity(rows: SpreadsheetRow[]) {
    if (!rows || !this.originalData) return;
    this.hasInvalidCells = rows.some(row => Object.values(row).find(cell => cell.error || cell.isNew));
    this.isUnchanged = isEqual(
      rows.map(row => utils.flattenRow(row, this.columns, this.useDeleteColumn)),
      this.originalData.map(row => utils.flattenRow(row, this.columns, this.useDeleteColumn)),
    );
    this.invalid = this.hasInvalidCells || (this.isUnchanged && this.isSaved);
    this.editedStateChanged.emit(this.isUnchanged);
  }

  doesExternalFilterPass(node: RowNode) {
    const invalid = Object.values((node.data as SpreadsheetRow)).some(cell => cell.error || cell.isNew);
    return this.filter === SpreadsheetFilter.Invalid ? invalid : !invalid;
  }

  isExternalFilterPresent() {
    return this.filter !== SpreadsheetFilter.All;
  }

  downloadTable() {
    const flatRows = this.grid.rowData.map(row => utils.flattenRow(row, this.columns, this.useDeleteColumn));
    downloadXlsx(flatRows, this.fileName);
  }

  undoAllChanges() {
    this.data = cloneDeep(this.originalData);
    this.checkValidity(this.data);
  }

  addRow() {
    const getNewCell = (column: SpreadsheetColumn): SpreadsheetCell => {
      return {
        value: {
          initial: null,
          valueType: column.options.dataType ?? ValueType.Text,
          options: { ...column.options },
        },
        error: null,
        isNew: column.header !== this.deleteColumnName,
        isDelete: column.header === this.deleteColumnName,
      };
    };

    const newRow: SpreadsheetRow = this.columns.reduce((row, column) => ({
      ...row,
      [column.header]: getNewCell(column),
    }), {});

    this.data = this.newRowPosition === NewRowPosition.Top ? [newRow, ...this.data] : [...this.data, newRow];
    this.gridChanged(this.data);
    this.editedStateChanged.emit(this.isUnchanged);
  }

  onSizeChange() {
    this.grid.api.sizeColumnsToFit();
  }
}
