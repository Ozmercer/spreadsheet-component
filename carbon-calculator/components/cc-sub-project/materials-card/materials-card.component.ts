import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { infoLabelValueOptions } from '@turntown/shared';
import { CarbonLineItem } from '../../../store';

@Component({
  selector: 'cp-materials-card',
  templateUrl: './materials-card.component.html',
  styleUrls: ['./materials-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsCardComponent {
  @Input() lineItem: CarbonLineItem;
  options = infoLabelValueOptions;

  constructor() { }

}
