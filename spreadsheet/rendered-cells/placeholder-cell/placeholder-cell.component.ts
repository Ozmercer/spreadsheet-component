import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'tt-placeholder-cell',
  templateUrl: './placeholder-cell.component.html',
  styleUrls: ['./placeholder-cell.component.scss'],
})
export class PlaceholderCellComponent implements ICellRendererAngularComp {
  placeholder: string;

  agInit(params) {
    this.placeholder = params.placeholder;
  }

  refresh(): boolean {
    return false;
  }
}
