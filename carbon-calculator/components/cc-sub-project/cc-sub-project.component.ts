import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { getCarbonOptions, selectActiveSubProject, selectCarbonIsLoading, selectCarbonLineItems } from '../../store';
import { costPlanningRoutes } from '../../../../cost-planning-routing.const';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { selectRouteParam } from '@turntown/shared/ngrx-store/router/router.selectors';
import { Subject } from 'rxjs';
import { getCurrentEstimates } from '../../../store/workspace.actions';

@Component({
  selector: 'cp-cc-sub-project',
  templateUrl: './cc-sub-project.component.html',
  styleUrls: ['./cc-sub-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CcSubProjectComponent implements OnInit, OnDestroy {
  activeSubProject$ = this.store.select(selectActiveSubProject);
  lineItems = this.store.select(selectCarbonLineItems);
  loading = this.store.select(selectCarbonIsLoading);
  unsubscribe$ = new Subject<void>();

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(getCurrentEstimates({}));

    this.activeSubProject$.pipe(takeUntil(this.unsubscribe$)).subscribe(subProject => {
      const momId = subProject?.estimateSummary?.momId;
      if (momId) {
        this.store.dispatch(getCarbonOptions({ momId }));
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  navigateToDataImport() {
    this.store.select(selectRouteParam('workspaceId')).pipe(
      take(1),
    ).subscribe((workspaceId) => {
      this.router.navigateByUrl(costPlanningRoutes.workspaceImport(workspaceId));
    });
  }
}
