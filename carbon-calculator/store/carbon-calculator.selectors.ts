import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureName } from './carbon-calculator.feature-name.const';
import { CarbonCalculatorModel, CarbonLineItem } from './carbon-calculator.interfaces';
import { selectIncludedSubProjects, selectIncludedSubProjectsData } from '../../store/workspace.selectors';
import { Link, RouterNgrxSelectors } from '@turntown/shared';
import { EstimatesActionType, selectAllEstimates, selectEstimatesLoading } from '../../../store';
import { CostPlanningEstimateCost, CostPlanningEstimateNode, CostPlanningEstimateValue } from '@turntown/api/open-api';

const selectCpCarbonCalculator = createFeatureSelector<CarbonCalculatorModel>(featureName);

export const selectCarbonOptionsMap = createSelector(selectCpCarbonCalculator, state => state?.optionsMap);

export const selectCarbonCalculatorLinks = createSelector(
  selectIncludedSubProjects, (includedSubProjects): Link[] => includedSubProjects.map(({ id, name }) => ({
      id,
      label: name,
      url: id,
      navigate: true,
    }),
  ),
);

export const selectActiveSubProject = createSelector(
  selectIncludedSubProjectsData,
  RouterNgrxSelectors.selectRouteParam('subProjectId'),
  (includedSubProjectsData, subProjectId) => includedSubProjectsData
    ?.find(includedSubProject => includedSubProject.subProject.id === subProjectId),
);

export const selectCodeEstimatesMap = createSelector(
  selectAllEstimates,
  selectActiveSubProject,
  (estimates, subProject) => {
    const map: { [key: string]: CostPlanningEstimateCost } = {};
    const getCodeAndCosts = (node: CostPlanningEstimateNode | CostPlanningEstimateValue) => {
      if ('costs' in node) {
        node.costs
          .filter(cost => cost.rate)
          .forEach(cost => map[`${node.code}/${cost.number}`] = cost);
      } else if (node.numberOfCosts > 0) {
        node.children.forEach(child => getCodeAndCosts(child));
      }
    };

    const rootElement = estimates.find(estimate => estimate.subProjectId === subProject?.subProject.id)?.rootCostElement;
    rootElement && getCodeAndCosts(rootElement);

    return map;
  },
);

export const selectCarbonLineItems = createSelector(
  selectCarbonOptionsMap,
  selectCodeEstimatesMap,
  (optionsMap, costEstimatesMap): CarbonLineItem[] => {
    return Object.entries(optionsMap).map(([code, options]) => ({
      code,
      estimate: costEstimatesMap[code] ?? { carbonHash: null },
      options,
    }));
  },
);

export const selectCarbonIsLoading = createSelector(
  selectCpCarbonCalculator,
  selectEstimatesLoading,
  (state, estimateLoading): boolean => {
    return state?.loading || estimateLoading[EstimatesActionType.getEstimates];
  },
);
