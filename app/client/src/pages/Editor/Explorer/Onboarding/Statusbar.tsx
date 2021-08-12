import { toggleOnboardingChecklist } from "actions/onboardingActions";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getActions,
  getCanvasWidgets,
  getDatasources,
} from "selectors/entitiesSelector";
import { getOnboardingCheckListVisibility } from "selectors/onboardingSelectors";
import styled from "styled-components";

const Wrapper = styled.div<{ active: boolean }>`
  width: 100%;
  background-color: ${(props) =>
    props.active ? props.theme.colors.welcomeTourStickySidebarBackground : ""};
  height: 90px;
  padding: 16px;
  cursor: ${(props) => (props.active ? "default" : "pointer")};
  transition: background-color 0.3s ease;
`;

const TitleWrapper = styled.p`
  color: #fff;
  font-size: 13px;
  font-weight: 600;
`;

const StatusText = styled.p`
  color: #fff;
  font-size: 13px;
`;

const ProgressContainer = styled.div`
  background-color: rgb(255, 255, 255, 0.35);
  border-radius: ${(props) => props.theme.radii[3]}px;
  overflow: hidden;
  margin-top: 12px;
`;

const Progressbar = styled.div<{ percentage: number }>`
  width: ${(props) => props.percentage}px;
  height: 4px;
  background: #fff;
  transistion: width 0.3s ease;
`;

function StatusProgressbar(props: any) {
  return (
    <ProgressContainer>
      <Progressbar {...props} />
    </ProgressContainer>
  );
}

export function Statusbar(props: any) {
  const isCheckoutPageShown = useSelector(getOnboardingCheckListVisibility);
  const datasources = useSelector(getDatasources);
  const actions = useSelector(getActions);
  const widgets = useSelector(getCanvasWidgets);
  const dispatch = useDispatch();
  let content;
  let precentage = 0;
  if (!datasources.length) {
    content = `First: Add a Datasource`;
    precentage = 20;
  } else if (!actions.length) {
    content = `Next: Add a Query`;
    precentage = 40;
  } else if (Object.keys(widgets).length == 1) {
    content = `Next: Add a Widget`;
    precentage = 60;
  }

  return (
    <Wrapper
      active={isCheckoutPageShown}
      onClick={() => dispatch(toggleOnboardingChecklist(true))}
    >
      <TitleWrapper>GET STARTED</TitleWrapper>
      <StatusText>{content}</StatusText>
      <StatusProgressbar percentage={precentage} />
    </Wrapper>
  );
}
