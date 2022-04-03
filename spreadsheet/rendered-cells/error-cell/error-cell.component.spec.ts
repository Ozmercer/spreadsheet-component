import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorCellComponent } from './error-cell.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { nullValue } from '@turntown/shared';

describe('ErrorCellComponent', () => {
  let component: ErrorCellComponent;
  let fixture: ComponentFixture<ErrorCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorCellComponent],
      imports: [MatIconModule, MatTooltipModule],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorCellComponent);
    component = fixture.componentInstance;
    component.value = nullValue;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
