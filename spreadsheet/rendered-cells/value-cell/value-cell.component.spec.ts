import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueCellComponent } from './value-cell.component';
import { MockPipes } from 'ng-mocks';
import { ValuePipe } from '@turntown/shared';

describe('ValueCellComponent', () => {
  let component: ValueCellComponent;
  let fixture: ComponentFixture<ValueCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValueCellComponent, MockPipes(ValuePipe)],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
