import { debuggerLogInit } from "actions/debuggerActions";
import { Severity, LogActionPayload, Log } from "entities/AppsmithConsole";
import moment from "moment";
import store from "store";

function log(ev: Log) {
  store.dispatch(debuggerLogInit(ev));
}

function getTimeStamp() {
  return moment().format("hh:mm:ss");
}

function info(ev: LogActionPayload) {
  log({
    ...ev,
    severity: Severity.INFO,
    timestamp: getTimeStamp(),
  });
}

function warning(ev: LogActionPayload) {
  log({
    ...ev,
    severity: Severity.WARNING,
    timestamp: getTimeStamp(),
  });
}

function error(ev: LogActionPayload) {
  log({
    ...ev,
    severity: Severity.ERROR,
    timestamp: getTimeStamp(),
  });
}

export default {
  info,
  warning,
  error,
};
