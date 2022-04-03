import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { MatDatepicker } from '@angular/material/datepicker';
import { GridApi } from 'ag-grid-community';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'tt-date-cell',
  templateUrl: './date-cell-editor.component.html',
  styleUrls: ['./date-cell-editor.component.scss'],
})
export class DateCellEditorComponent implements ICellEditorAngularComp, AfterViewInit, OnDestroy {
  @ViewChild('picker') picker: MatDatepicker<any>;

  gridApi: GridApi;
  date: Date;
  invalidString: string;
  private readonly unsubscribe$ = new Subject();

  agInit(params) {
    this.gridApi = params.api;
    this.date = params.value.initial && new Date(params.value.initial);
  }

  ngAfterViewInit() {
    this.picker.closedStream.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.gridApi.stopEditing());
  }

  onInput(input) {
    this.invalidString = input.value;
  }

  getValue() {
    return this.date || this.invalidString;
  }

  isPopup(): boolean {
    return true;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
