import { IPanelProps } from "@blueprintjs/core";
import React from "react";
import { useSelector } from "react-redux";
import { inOnboarding, isAddWidgetComplete } from "sagas/OnboardingSagas";
import { getGetStarted } from "selectors/entitiesSelector";
import EntityExplorer from "./EntityExplorer";
import OnboardingExplorer from "./Onboarding";
import { Statusbar } from "./Onboarding/Statusbar";

function ExplorerContent(props: IPanelProps) {
  const isInOnboarding = useSelector(inOnboarding);
  const addWidgetComplete = useSelector(isAddWidgetComplete);
  const showOnboardingStatusbar = useSelector(getGetStarted);

  if (isInOnboarding && !addWidgetComplete) {
    return <OnboardingExplorer {...props} />;
  }

  return (
    <>
      {showOnboardingStatusbar && <Statusbar />}
      <EntityExplorer {...props} />
    </>
  );
}

export default ExplorerContent;
