import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsCardComponent } from './materials-card.component';
import { MockComponents, MockPipes } from 'ng-mocks';
import {
  CardComponent,
  CardContentComponent,
  InfoSummaryComponent,
  LabelValueComponent,
  StatusPillComponent,
} from '@turntown/components';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialsTableComponent } from '../materials-table/materials-table.component';
import { CarbonLineItem } from '../../../store';
import { TtDecimalPipe } from '@turntown/shared';

describe('SubProjectCardComponent', () => {
  let component: MaterialsCardComponent;
  let fixture: ComponentFixture<MaterialsCardComponent>;
  const mockLineItem: CarbonLineItem = {
    code: '',
    estimate: { carbonHash: null },
    options: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialsCardComponent, MockPipes(TtDecimalPipe), MockComponents(
        CardComponent,
        CardContentComponent,
        InfoSummaryComponent,
        LabelValueComponent,
        MaterialsTableComponent,
        StatusPillComponent,
      )],
      imports: [ReactiveFormsModule, MatSelectModule, BrowserAnimationsModule],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsCardComponent);
    component = fixture.componentInstance;
    component.lineItem = mockLineItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
