import WidgetBuilderRegistry from "./WidgetRegistry";
import PropertyControlRegistry from "./PropertyControlRegistry";
import { getDependenciesFromInverseDependencies } from "components/editorComponents/Debugger/helpers";
import { AppState } from "reducers";
import { useSelector } from "react-redux";
import _ from "lodash";

export const editorInitializer = async () => {
  WidgetBuilderRegistry.registerWidgetBuilders();
  PropertyControlRegistry.registerPropertyControlBuilders();

  const moment = await import("moment-timezone");
  moment.tz.setDefault(moment.tz.guess());
};
