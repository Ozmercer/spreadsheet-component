import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceholderCellComponent } from './placeholder-cell.component';

describe('PlaceholderCellComponent', () => {
  let component: PlaceholderCellComponent;
  let fixture: ComponentFixture<PlaceholderCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaceholderCellComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceholderCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
