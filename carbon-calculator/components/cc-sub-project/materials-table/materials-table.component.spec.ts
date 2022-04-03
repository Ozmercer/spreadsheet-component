import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsTableComponent } from './materials-table.component';
import { MockComponents } from 'ng-mocks';
import { SpreadsheetComponent } from '@turntown/components';

describe('MaterialsTableComponent', () => {
  let component: MaterialsTableComponent;
  let fixture: ComponentFixture<MaterialsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialsTableComponent, MockComponents(SpreadsheetComponent)],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
