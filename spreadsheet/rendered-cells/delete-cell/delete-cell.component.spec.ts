import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCellComponent } from './delete-cell.component';
import { MatIconModule } from '@angular/material/icon';

describe('DeleteCellComponent', () => {
  let component: DeleteCellComponent;
  let fixture: ComponentFixture<DeleteCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteCellComponent],
      imports: [MatIconModule],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
