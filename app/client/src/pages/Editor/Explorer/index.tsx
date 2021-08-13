import { IPanelProps } from "@blueprintjs/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { inOnboarding, isAddWidgetComplete } from "sagas/OnboardingSagas";
import { getCurrentApplicationId } from "selectors/editorSelectors";
import { getCurrentUser } from "selectors/usersSelectors";
import {
  getEnableFirstTimeUserExperience,
  getFirstTimeUserExperienceApplicationId,
} from "utils/storage";
import EntityExplorer from "./EntityExplorer";
import OnboardingExplorer from "./Onboarding";
import Statusbar from "./Onboarding/Statusbar";

function ExplorerContent(props: IPanelProps) {
  const isInOnboarding = useSelector(inOnboarding);
  const addWidgetComplete = useSelector(isAddWidgetComplete);
  const currentUser = useSelector(getCurrentUser);
  const [
    enableFirstTimeUserExperience,
    setEnableFirstTimeUserExperience,
  ] = useState(false);
  const applicationId = useSelector(getCurrentApplicationId);

  useEffect(() => {
    (async () => {
      const enable = await getEnableFirstTimeUserExperience();
      const enabledApplicationId = await getFirstTimeUserExperienceApplicationId();
      if (enable && enabledApplicationId == applicationId) {
        setEnableFirstTimeUserExperience(true);
      }
    })();
  }, [currentUser]);

  if (isInOnboarding && !addWidgetComplete) {
    return <OnboardingExplorer {...props} />;
  }

  return (
    <>
      {enableFirstTimeUserExperience && <Statusbar />}
      <EntityExplorer {...props} />
    </>
  );
}

export default ExplorerContent;
