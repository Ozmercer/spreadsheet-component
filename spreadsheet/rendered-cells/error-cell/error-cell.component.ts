import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Value } from '@turntown/shared';

@Component({
  selector: 'tt-error-cell',
  templateUrl: './error-cell.component.html',
  styleUrls: ['./error-cell.component.scss'],
})
export class ErrorCellComponent implements ICellRendererAngularComp {
  value: Value;
  tooltip: string;

  agInit(params) {
    this.value = params.value;
    this.tooltip = params.tooltip;
  }

  refresh(): boolean {
    return false;
  }
}
