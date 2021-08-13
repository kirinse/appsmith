import { toggleInOnboardingWidgetSelection } from "actions/onboardingActions";
import Button from "components/ads/Button";
import { ReduxActionTypes } from "constants/ReduxActionConstants";
import { INTEGRATION_EDITOR_URL, INTEGRATION_TABS } from "constants/routes";
import React from "react";
import { useDispatch } from "react-redux";
import {
  getCurrentApplicationId,
  getCurrentPageId,
} from "selectors/editorSelectors";
import {
  getActions,
  getCanvasWidgets,
  getDatasources,
} from "selectors/entitiesSelector";
import { useSelector } from "store";
import styled from "styled-components";
import history from "utils/history";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 36px);
  margin: 0 auto;
  background-color: #fff;
`;

const CenteredContainer = styled.div`
  text-align: center;
  width: 529px;
`;

const ActionImageContainer = styled.div`
  width: 220px;
  margin: 0 auto;
`;

const ActionImage = styled.img`
  width: 100%;
`;

const ActionHeader = styled.h1`
  width: 100%;
`;

const ActionSubText = styled.p`
  width: 100%;
`;

const ActionButtonWrapper = styled.div`
  margin-top: 30px;
`;

const StyledButton = styled(Button)`
  width: 208px;
  margin: 0 auto;
  height: 38px;
`;

const Actionfootnote = styled.p`
  margin-top: 30px;
  & span {
    color: ${(props) => props.theme.colors.welcomeTourStickySidebarBackground};
    font-weight: 600;
    cursor: pointer;
  }
`;

export default function OnboardingTasks() {
  const applicationId = useSelector(getCurrentApplicationId);
  const pageId = useSelector(getCurrentPageId);
  let content;
  const datasources = useSelector(getDatasources);
  const actions = useSelector(getActions);
  const widgets = useSelector(getCanvasWidgets);
  const dispatch = useDispatch();
  if (!datasources.length) {
    content = (
      <CenteredContainer>
        <ActionImageContainer>
          <ActionImage src="https://assets.appsmith.com/onboarding-datasource.png" />
        </ActionImageContainer>
        <ActionHeader>Start by adding your first Data source</ActionHeader>
        <ActionSubText>
          Adding a data source makes creating applications more powerful. Don’t
          worry if you don’t have any data to hand, we have sample data you can
          use.
        </ActionSubText>
        <ActionButtonWrapper>
          <StyledButton
            onClick={() =>
              history.push(
                INTEGRATION_EDITOR_URL(
                  applicationId,
                  pageId,
                  INTEGRATION_TABS.NEW,
                ),
              )
            }
            tag="button"
            text="+ create a datasource"
            type="button"
          />
        </ActionButtonWrapper>
        <Actionfootnote>
          Alternatively you can also&nbsp;
          <span
            onClick={() => dispatch(toggleInOnboardingWidgetSelection(true))}
          >
            Add widgets
          </span>
          &nbsp;first.
        </Actionfootnote>
      </CenteredContainer>
    );
  } else if (!actions.length) {
    content = (
      <CenteredContainer>
        <ActionImageContainer>
          <ActionImage src="https://assets.appsmith.com/onboarding-query.png" />
        </ActionImageContainer>
        <ActionHeader>Next, create a query</ActionHeader>
        <ActionSubText>
          Great job adding a data source! The next thing you can do is create a
          query on your data.
        </ActionSubText>
        <ActionButtonWrapper>
          <StyledButton
            onClick={() =>
              history.push(
                INTEGRATION_EDITOR_URL(
                  applicationId,
                  pageId,
                  INTEGRATION_TABS.ACTIVE,
                ),
              )
            }
            tag="button"
            text="+ create a query"
            type="button"
          />
        </ActionButtonWrapper>
        <Actionfootnote>
          Alternatively you can also&nbsp;
          <span
            onClick={() => dispatch(toggleInOnboardingWidgetSelection(true))}
          >
            Add widgets
          </span>
        </Actionfootnote>
      </CenteredContainer>
    );
  } else if (Object.keys(widgets).length == 1) {
    content = (
      <CenteredContainer>
        <ActionImageContainer>
          <ActionImage src="https://assets.appsmith.com/onboarding-query.png" />
        </ActionImageContainer>
        <ActionHeader>Next, add a widget to start displaying data</ActionHeader>
        <ActionSubText>
          Great job adding a data source! The next thing you can do is add
          widget to start start making your data visual.
        </ActionSubText>
        <ActionButtonWrapper>
          <StyledButton
            onClick={() => dispatch(toggleInOnboardingWidgetSelection(true))}
            tag="button"
            text="+ Add a Widget"
            type="button"
          />
        </ActionButtonWrapper>
        <Actionfootnote>
          Alternatively you can also&nbsp;
          <span
            onClick={() =>
              dispatch({
                type: ReduxActionTypes.PUBLISH_APPLICATION_INIT,
                payload: {
                  applicationId,
                },
              })
            }
          >
            Deploy your applications
          </span>
          .
        </Actionfootnote>
      </CenteredContainer>
    );
  }
  return <Wrapper>{content}</Wrapper>;
}
