import Button, { Category } from "components/ads/Button";
import Text, { TextType } from "components/ads/Text";
import { Icon } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { toggleOnboardingChecklist } from "actions/onboardingActions";
import { useSelector } from "store";
import {
  getActions,
  getCanvasWidgets,
  getDatasources,
} from "selectors/entitiesSelector";
import { getCurrentThemeDetails } from "selectors/themeSelectors";
import _ from "lodash";
import { useIsWidgetActionConnectionPresent } from "pages/Editor/utils";
import { getEvaluationInverseDependencyMap } from "selectors/dataTreeSelectors";

const Wrapper = styled.div`
  padding: 15px 55px;
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

const BackWrapper = styled.div`
  cursor: pointer;
`;

export default function OnboardingChecklist(props: any) {
  const dispatch = useDispatch();
  const datasources = useSelector(getDatasources);
  const actions = useSelector(getActions);
  const widgets = useSelector(getCanvasWidgets);
  const deps = useSelector(getEvaluationInverseDependencyMap);
  const connections = useIsWidgetActionConnectionPresent(
    widgets,
    actions,
    deps,
  );
  const theme = useSelector(getCurrentThemeDetails);
  let suggestedNextAction;
  if (!datasources.length) {
    suggestedNextAction = "CREATE A DATASOURCE";
  } else if (!actions.length) {
    suggestedNextAction = "CREATE A QUERY";
  } else if (Object.keys(widgets).length == 1) {
    suggestedNextAction = "ADD WIDGETS";
  }
  return (
    <Wrapper>
      <BackWrapper onClick={() => dispatch(toggleOnboardingChecklist(false))}>
        <Icon color="#716E6E" icon="chevron-left" iconSize={16} />
        &nbsp;
        <Text
          style={{ color: "#716E6E", lineHeight: "14px" }}
          type={TextType.P1}
        >
          Back
        </Text>
      </BackWrapper>
      <Pageheader>👋 Welcome to Appsmith!</Pageheader>
      <PageSubHeader>
        Let’s get you started on your first application, explore Appsmith
        yourself or follow our guide below to discover what Appsmith can do.
      </PageSubHeader>
      <StatusWrapper>
        <span>1 of 5</span> completed
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
          <StyledButton
            category={
              suggestedNextAction == "ADD WIDGETS"
                ? Category.primary
                : Category.tertiary
            }
            text="ADD WIDGETS"
            type="button"
          />
        </StyledListItem>
        <StyledListItem>
          <StyledCompleteMarker>
            <CompeleteMarkerIcon success={!!connections}>
              <Icon
                color={connections ? theme.colors.success.main : "#A9A7A7"}
                icon={connections ? "tick-circle" : "small-tick"}
                iconSize={17}
              />
            </CompeleteMarkerIcon>
          </StyledCompleteMarker>
          <ChecklistText>
            <span>Connect your data to the widgets</span> using JavaScript.
          </ChecklistText>
          <StyledButton
            category={
              suggestedNextAction == "CONNECT DATA TO WIDGETS"
                ? Category.primary
                : Category.tertiary
            }
            disabled
            text="CONNECT DATA TO WIDGETS"
            type="button"
          />
        </StyledListItem>
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
            <span>Deploy your application</span>, and see your creation live.
          </ChecklistText>
          <StyledButton
            category={
              suggestedNextAction == "DEPLOY APPLICATIONS"
                ? Category.primary
                : Category.tertiary
            }
            text="DEPLOY APPLICATIONS"
            type="button"
          />
        </StyledListItem>
      </StyledList>
    </Wrapper>
  );
}
