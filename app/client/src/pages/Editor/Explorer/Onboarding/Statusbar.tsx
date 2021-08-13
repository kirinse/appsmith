import { Icon } from "@blueprintjs/core";
import { ReduxActionTypes } from "constants/ReduxActionConstants";
import { getOnboardingCheckListUrl } from "constants/routes";
import { useIsWidgetActionConnectionPresent } from "pages/Editor/utils";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { getEvaluationInverseDependencyMap } from "selectors/dataTreeSelectors";
import {
  getCurrentApplicationId,
  getCurrentPageId,
} from "selectors/editorSelectors";
import {
  getActions,
  getCanvasWidgets,
  getDatasources,
} from "selectors/entitiesSelector";
import styled from "styled-components";
import { getFirstTimeUserExperienceApplicationId } from "utils/storage";

const Wrapper = styled.div<{ active: boolean }>`
  position: relative;
  width: 100%;
  background-color: ${(props) =>
    props.active ? props.theme.colors.welcomeTourStickySidebarBackground : ""};
  height: 90px;
  padding: 16px;
  cursor: ${(props) => (props.active ? "default" : "pointer")};
  transition: background-color 0.3s ease;

  &:hover .hover-icons {
    opacity: 1;
  }
`;

const TitleWrapper = styled.p`
  color: #fff;
  font-size: 13px;
  font-weight: 600;
`;

const StatusText = styled.p`
  color: #fff;
  font-size: 13px;
  & span {
    transform: translate(3px, 0px);
    opacity: 0;
  }
`;

const ProgressContainer = styled.div`
  background-color: rgb(255, 255, 255, 0.35);
  border-radius: ${(props) => props.theme.radii[3]}px;
  overflow: hidden;
  margin-top: 12px;
`;

const Progressbar = styled.div<{ percentage: number }>`
  width: ${(props) => props.percentage}%;
  height: 4px;
  background: #fff;
  transition: width 0.3s ease;
`;

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;

const StyledClose = styled(Icon)`
  position: absolute;
  top: 19px;
  right: 13px;
  opacity: 0;
`;

function StatusProgressbar(props: any) {
  return (
    <ProgressContainer>
      <Progressbar {...props} />
    </ProgressContainer>
  );
}

const useStatus = (): { percentage: number; content: string } => {
  const datasources = useSelector(getDatasources);
  const actions = useSelector(getActions);
  const widgets = useSelector(getCanvasWidgets);
  const deps = useSelector(getEvaluationInverseDependencyMap);
  const isConnectionPresent = useIsWidgetActionConnectionPresent(
    widgets,
    actions,
    deps,
  );
  const isDeployed = true;

  let content = "";
  let percentage = 0;
  if (!datasources.length) {
    content = `${
      Object.keys(widgets).length == 1 ? "First" : "Next"
    }: Add a Datasource`;
  } else if (!actions.length) {
    content = `Next: Add a Query`;
  } else if (Object.keys(widgets).length == 1) {
    content = `Next: Add a Widget`;
  } else if (!isConnectionPresent) {
    content = `Next: Connect your Widget`;
  } else if (!isDeployed) {
    content = `Next: Deploy your application`;
  } else {
    content = `Completed 🎉`;
  }

  if (datasources.length) {
    percentage += 20;
  }

  if (actions.length) {
    percentage += 20;
  }

  if (Object.keys(widgets).length > 1) {
    percentage += 20;
  }

  if (isConnectionPresent) {
    percentage += 20;
  }

  if (isDeployed) {
    percentage += 20;
  }

  return {
    percentage,
    content,
  };
};

function Statusbar() {
  const dispatch = useDispatch();
  const applicationId = useSelector(getCurrentApplicationId);
  const pageId = useSelector(getCurrentPageId);
  const { content, percentage } = useStatus();
  const isChecklistPage = window.location.pathname.indexOf("/checklist") > -1;
  const [showStatusbar, setShowStatusBar] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      const isGenerateAppPage =
        window.location.pathname.indexOf("/generate-page/form") > -1;
      const enabledApplicationId = await getFirstTimeUserExperienceApplicationId();
      setShowStatusBar(
        enabledApplicationId == applicationId && !isGenerateAppPage,
      );
    })();
  });
  if (!showStatusbar) {
    return null;
  }
  if (percentage == 100) {
    dispatch({
      type: ReduxActionTypes.TOGGLE_FIRST_TIME_USER_EXPERIENCE,
      payload: {
        flag: false,
        applicationId: "",
      },
    });
  }

  return (
    <StyledLink to={getOnboardingCheckListUrl(applicationId, pageId)}>
      <Wrapper active={isChecklistPage}>
        <StyledClose
          className="hover-icons"
          color="#fff"
          icon="cross"
          iconSize={14}
        />
        <TitleWrapper>GET STARTED</TitleWrapper>
        <StatusText>
          {content}&nbsp;&nbsp;
          {!isChecklistPage && (
            <Icon
              className="hover-icons"
              color="#fff"
              icon="chevron-right"
              iconSize={14}
            />
          )}
        </StatusText>
        <StatusProgressbar percentage={percentage} />
      </Wrapper>
    </StyledLink>
  );
}

export default withRouter(Statusbar);
