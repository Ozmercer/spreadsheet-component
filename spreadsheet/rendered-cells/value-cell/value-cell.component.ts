import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'tt-default-cell',
  templateUrl: './value-cell.component.html',
  styleUrls: ['./value-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueCellComponent implements ICellRendererAngularComp {
  value: string;
  prefix: string;
  suffix: string;

  agInit(params) {
    this.value = params.value;
    this.prefix = params.prefix;
    this.suffix = params.suffix;
  }

  refresh(): boolean {
    return false;
  }
}
