import { AppState } from "reducers";

export const getIsOnboardingHelperVisible = (state: AppState) => {
  const urlSearchParams = new URL(window.location.href).searchParams;
  const isCommentModeInUrl = urlSearchParams.get("isCommentMode");
  return state.ui.onBoarding.showHelper && !isCommentModeInUrl;
};

export const getOnboardingCheckListVisibility = (state: AppState) => {
  return state.ui.onBoarding.showOnboardingChecklist;
};

export const getInOnboarding = (state: AppState) => {
  return state.ui.onBoarding.inOnboarding;
};

export const getCurrentStep = (state: AppState) => {
  return state.ui.onBoarding.currentStep;
};
