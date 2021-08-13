import Button, { Category } from "components/ads/Button";
import Text, { TextType } from "components/ads/Text";
import { Icon } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useSelector } from "store";
import {
  getActions,
  getCanvasWidgets,
  getDatasources,
} from "selectors/entitiesSelector";
import { getCurrentThemeDetails } from "selectors/themeSelectors";
import { useIsWidgetActionConnectionPresent } from "pages/Editor/utils";
import { getEvaluationInverseDependencyMap } from "selectors/dataTreeSelectors";
import {
  BUILDER_PAGE_URL,
  INTEGRATION_EDITOR_URL,
  INTEGRATION_TABS,
} from "constants/routes";
import {
  getCurrentApplicationId,
  getCurrentPageId,
} from "selectors/editorSelectors";
import { Link } from "react-router-dom";
import history from "utils/history";
import { toggleInOnboardingWidgetSelection } from "actions/onboardingActions";
import { ReduxActionTypes } from "constants/ReduxActionConstants";

const Wrapper = styled.div`
  padding: 15px 55px;
  background: #fff;
`;

const Pageheader = styled.h1`
  width: 100%;
`;

const PageSubHeader = styled.p`
  width: 100%;
  margin-bottom: 30px;
`;

const StatusWrapper = styled.p`
  width: 100%;
  margin-bottom: 30px;
  & span {
    font-weight: 700;
  }
`;

const StyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  width: ${(props) => props.theme.pageContentWidth}px;
  height: calc(100vh - 220px);
  overflow: auto;
`;

const StyledListItem = styled.li`
  width: 100%;
  display: flex;
  padding: 30px 0px;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.grid};
  &:first-child {
    border-top: 1px solid ${(props) => props.theme.colors.grid};
  }
`;

const ChecklistText = styled.div`
  flex-basis: 80%;
  & span {
    font-weight: 700;
  }
`;

const CompeleteMarkerIcon = styled.div<{ success: boolean }>`
  width: 25px;
  height: 25px;
  border-radius: 30px;
  border: 2px solid;
  border-color: ${(props) =>
    props.success ? props.theme.colors.success.main : "#A9A7A7"};
  padding: 2px 2px;
`;

const StyledCompleteMarker = styled.div`
  flex-basis: 50px;
`;

const StyledButton = styled(Button)`
  width: 218px;
  height: 30px;
`;

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;

export default function OnboardingChecklist() {
  const dispatch = useDispatch();
  const datasources = useSelector(getDatasources);
  const actions = useSelector(getActions);
  const widgets = useSelector(getCanvasWidgets);
  const deps = useSelector(getEvaluationInverseDependencyMap);
  const isConnectionPresent = useIsWidgetActionConnectionPresent(
    widgets,
    actions,
    deps,
  );
  const theme = useSelector(getCurrentThemeDetails);
  const applicationId = useSelector(getCurrentApplicationId);
  const pageId = useSelector(getCurrentPageId);
  const isDeployed = true;
  let suggestedNextAction;
  if (!datasources.length) {
    suggestedNextAction = "CREATE A DATASOURCE";
  } else if (!actions.length) {
    suggestedNextAction = "CREATE A QUERY";
  } else if (Object.keys(widgets).length == 1) {
    suggestedNextAction = "ADD WIDGETS";
  } else if (!isConnectionPresent) {
    suggestedNextAction = "CONNECT DATA TO WIDGET";
  } else if (!isDeployed) {
    suggestedNextAction = "DEPLOY APPLICATIONS";
  }
  let completedTasks = 0;

  if (datasources.length) {
    completedTasks += 1;
  }
  if (actions.length) {
    completedTasks += 1;
  }
  if (Object.keys(widgets).length > 1) {
    completedTasks += 1;
  }
  if (isConnectionPresent) {
    completedTasks += 1;
  }
  if (isDeployed) {
    completedTasks += 1;
  }
  return (
    <Wrapper>
      <StyledLink to={BUILDER_PAGE_URL(applicationId, pageId)}>
        <Icon color="#716E6E" icon="chevron-left" iconSize={16} />
        &nbsp;
        <Text
          style={{ color: "#716E6E", lineHeight: "14px" }}
          type={TextType.P1}
        >
          Back
        </Text>
      </StyledLink>
      <Pageheader>👋 Welcome to Appsmith!</Pageheader>
      <PageSubHeader>
        Let’s get you started on your first application, explore Appsmith
        yourself or follow our guide below to discover what Appsmith can do.
      </PageSubHeader>
      <StatusWrapper>
        <span>{completedTasks} of 5</span> completed
      </StatusWrapper>
      <StyledList>
        <StyledListItem>
          <StyledCompleteMarker>
            <CompeleteMarkerIcon success={!!datasources.length}>
              <Icon
                color={
                  datasources.length ? theme.colors.success.main : "#A9A7A7"
                }
                icon={datasources.length ? "tick-circle" : "small-tick"}
                iconSize={17}
              />
            </CompeleteMarkerIcon>
          </StyledCompleteMarker>
          <ChecklistText>
            <span>Connect your data source</span> to start building an
            application.
          </ChecklistText>
          {!datasources.length && (
            <StyledButton
              category={
                suggestedNextAction == "CREATE A DATASOURCE"
                  ? Category.primary
                  : Category.tertiary
              }
              onClick={() =>
                history.push(
                  INTEGRATION_EDITOR_URL(
                    applicationId,
                    pageId,
                    INTEGRATION_TABS.NEW,
                  ),
                )
              }
              text="CREATE A DATASOURCE"
              type="button"
            />
          )}
        </StyledListItem>
        <StyledListItem>
          <StyledCompleteMarker>
            <CompeleteMarkerIcon success={!!actions.length}>
              <Icon
                color={actions.length ? theme.colors.success.main : "#A9A7A7"}
                icon={actions.length ? "tick-circle" : "small-tick"}
                iconSize={17}
              />
            </CompeleteMarkerIcon>
          </StyledCompleteMarker>
          <ChecklistText>
            <span>Create a query</span> of your data source.
          </ChecklistText>
          {!actions.length && (
            <StyledButton
              category={
                suggestedNextAction == "CREATE A QUERY"
                  ? Category.primary
                  : Category.tertiary
              }
              disabled={!datasources.length}
              onClick={() =>
                history.push(
                  INTEGRATION_EDITOR_URL(
                    applicationId,
                    pageId,
                    INTEGRATION_TABS.ACTIVE,
                  ),
                )
              }
              text="CREATE A QUERY"
              type="button"
            />
          )}
        </StyledListItem>
        <StyledListItem>
          <StyledCompleteMarker>
            <CompeleteMarkerIcon success={Object.keys(widgets).length > 1}>
              <Icon
                color={
                  Object.keys(widgets).length > 1
                    ? theme.colors.success.main
                    : "#A9A7A7"
                }
                icon={
                  Object.keys(widgets).length > 1 ? "tick-circle" : "small-tick"
                }
                iconSize={17}
              />
            </CompeleteMarkerIcon>
          </StyledCompleteMarker>
          <ChecklistText>
            <span>Start visualising your application</span> using widgets.
          </ChecklistText>
          {Object.keys(widgets).length == 1 && (
            <StyledButton
              category={
                suggestedNextAction == "ADD WIDGETS"
                  ? Category.primary
                  : Category.tertiary
              }
              onClick={() => {
                dispatch(toggleInOnboardingWidgetSelection(true));
                history.push(BUILDER_PAGE_URL(applicationId, pageId));
              }}
              text="ADD WIDGETS"
              type="button"
            />
          )}
        </StyledListItem>
        <StyledListItem>
          <StyledCompleteMarker>
            <CompeleteMarkerIcon success={!!isConnectionPresent}>
              <Icon
                color={
                  isConnectionPresent ? theme.colors.success.main : "#A9A7A7"
                }
                icon={isConnectionPresent ? "tick-circle" : "small-tick"}
                iconSize={17}
              />
            </CompeleteMarkerIcon>
          </StyledCompleteMarker>
          <ChecklistText>
            <span>Connect your data to the widgets</span> using JavaScript.
          </ChecklistText>
          {!isConnectionPresent && (
            <StyledButton
              category={
                suggestedNextAction == "CONNECT DATA TO WIDGET"
                  ? Category.primary
                  : Category.tertiary
              }
              disabled={Object.keys(widgets).length == 1}
              onClick={() => {
                history.push(BUILDER_PAGE_URL(applicationId, pageId));
              }}
              text="CONNECT DATA TO WIDGETS"
              type="button"
            />
          )}
        </StyledListItem>
        <StyledListItem>
          <StyledCompleteMarker>
            <CompeleteMarkerIcon success={!!isDeployed}>
              <Icon
                color={isDeployed ? theme.colors.success.main : "#A9A7A7"}
                icon={isDeployed ? "tick-circle" : "small-tick"}
                iconSize={17}
              />
            </CompeleteMarkerIcon>
          </StyledCompleteMarker>
          <ChecklistText>
            <span>Deploy your application</span>, and see your creation live.
          </ChecklistText>
          {!isDeployed && (
            <StyledButton
              category={
                suggestedNextAction == "DEPLOY APPLICATIONS"
                  ? Category.primary
                  : Category.tertiary
              }
              onClick={() =>
                dispatch({
                  type: ReduxActionTypes.PUBLISH_APPLICATION_INIT,
                  payload: {
                    applicationId,
                  },
                })
              }
              text="DEPLOY APPLICATIONS"
              type="button"
            />
          )}
        </StyledListItem>
      </StyledList>
    </Wrapper>
  );
}
