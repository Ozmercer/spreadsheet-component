import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueCellEditorComponent } from './value-cell-editor.component';
import { nullValue } from '@turntown/shared';
import { FormsModule } from '@angular/forms';

describe('ValueCellEditorComponent', () => {
  let component: ValueCellEditorComponent;
  let fixture: ComponentFixture<ValueCellEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValueCellEditorComponent],
      imports: [FormsModule],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueCellEditorComponent);
    component = fixture.componentInstance;
    component.value = nullValue;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
