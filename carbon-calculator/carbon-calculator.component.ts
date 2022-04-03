import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveSubProject, selectCarbonCalculatorLinks } from './store';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { concatLatestFrom } from '@ngrx/effects';

@Component({
  selector: 'cp-carbon-calculator',
  templateUrl: './carbon-calculator.component.html',
  styleUrls: ['./carbon-calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonCalculatorComponent implements OnInit {
  carbonCalculatorLinks$ = this.store.select(selectCarbonCalculatorLinks);

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.store.select(selectActiveSubProject).pipe(
      first(),
      concatLatestFrom(() => this.carbonCalculatorLinks$),
    ).subscribe(([active, links]) => {
      if (!active) {
        // Navigate to first tab if none are active
        this.router.navigate([links[0].url], { relativeTo: this.route });
      }
    });
  }
}
