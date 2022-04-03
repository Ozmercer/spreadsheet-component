import {
  CostPlanningCarbonCalculatorOption,
  CostPlanningEstimateCost,
  CostXWorkbook,
  HiveSubProject,
} from '@turntown/api/open-api';

export interface CarbonCalculatorModel {
  optionsMap: CarbonOptionsByCodeMap;
  loading: boolean;
}

export interface CCActiveSubProject {
  subProject: HiveSubProject;
  costxWorkbook: CostXWorkbook;
}

export interface CarbonLineItem {
  code: string;
  estimate: CostPlanningEstimateCost;
  options: CostPlanningCarbonCalculatorOption[];
}

export interface CarbonOptionsByCodeMap {
  [key: string]: CostPlanningCarbonCalculatorOption[];
}
