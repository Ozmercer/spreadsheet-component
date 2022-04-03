import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterCellComponent } from './footer-cell.component';
import { MockPipes } from 'ng-mocks';
import { ValuePipe } from '@turntown/shared';

describe('FooterCellComponent', () => {
  let component: FooterCellComponent;
  let fixture: ComponentFixture<FooterCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterCellComponent, MockPipes(ValuePipe)],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
