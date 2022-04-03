import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'tt-footer-cell',
  templateUrl: './footer-cell.component.html',
  styleUrls: ['./footer-cell.component.scss'],
})
export class FooterCellComponent implements ICellRendererAngularComp {
  value: string;

  agInit(params) {
    this.value = params.override ?? params.value;
  }

  refresh(): boolean {
    return false;
  }
}
