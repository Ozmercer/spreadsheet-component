import { Component, ElementRef, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'tt-value-cell-editor',
  templateUrl: './value-cell-editor.component.html',
  styleUrls: ['./value-cell-editor.component.scss'],
})
export class ValueCellEditorComponent implements ICellEditorAngularComp {
  @ViewChild('inputElement') set input(i: ElementRef) {
    // Timeout is required, also used in documentation https://www.ag-grid.com/angular-data-grid/component-cell-editor/
    setTimeout(() => (i.nativeElement as HTMLInputElement).focus());
  };

  value: any;

  agInit(params) {
    this.value = params.value.initial;
  }

  getValue(): any {
    return this.value;
  }

}

