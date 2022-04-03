import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateCellEditorComponent } from './date-cell-editor.component';
import { MockComponent } from 'ng-mocks';
import { CardContentComponent } from '../../../card/content/content.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

describe('DateCellComponent', () => {
  let component: DateCellEditorComponent;
  let fixture: ComponentFixture<DateCellEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateCellEditorComponent, MockComponent(CardContentComponent)],
      imports: [MatDatepickerModule, MatNativeDateModule, FormsModule],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
