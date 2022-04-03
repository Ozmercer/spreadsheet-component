import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'tt-delete-cell',
  templateUrl: './delete-cell.component.html',
  styleUrls: ['./delete-cell.component.scss'],
})
export class DeleteCellComponent implements ICellRendererAngularComp {
  icon: string;

  agInit(params) {
    this.icon = params.icon;
  }

  refresh(): boolean {
    return false;
  }
}
