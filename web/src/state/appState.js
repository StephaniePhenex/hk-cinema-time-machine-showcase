export const ROUTES = {
  INPUT: 'input',
  EMPTY: 'empty',
  RESULT: 'result',
  SHARE: 'share',
};

export const STATUSES = {
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
};

export const RETRY_ACTIONS = {
  NONE: 'none',
  LOAD_DATA: 'loadData',
  DOWNLOAD: 'download',
  RESET_INPUT: 'resetInput',
};

const appState = {
  route: ROUTES.INPUT,
  status: STATUSES.LOADING,
  errorMessage: '',
  selectedDate: null,
  films: [],
  name: '',
  dailyClassics: null,
  uiFlags: {
    omitNameForDynamicText: false,
    retryActionKey: RETRY_ACTIONS.NONE,
  },
};

let renderListener = () => {};

function notify() {
  renderListener(getState());
}

export function subscribeRender(listener) {
  renderListener = listener;
}

export function getState() {
  return {
    ...appState,
    uiFlags: { ...appState.uiFlags },
  };
}

function assertValidRoute(route) {
  if (!Object.values(ROUTES).includes(route)) {
    throw new Error(`Invalid route: ${route}`);
  }
}

function assertValidStatus(status) {
  if (!Object.values(STATUSES).includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
}

function notifyWith(partial) {
  Object.assign(appState, partial);
  notify();
}

export function updateState(partial) {
  notifyWith(partial);
}

export function setRoute(route) {
  assertValidRoute(route);
  notifyWith({ route });
}

export function setStatus(status) {
  assertValidStatus(status);
  notifyWith({ status });
}

export function setError(message) {
  notifyWith({
    status: STATUSES.ERROR,
    errorMessage: message || '发生未知错误',
  });
}

export function clearError() {
  notifyWith({ errorMessage: '' });
}

export function setSelection({ selectedDate, films, name }) {
  notifyWith({
    selectedDate: selectedDate || null,
    films: Array.isArray(films) ? films : [],
    name: (name || '').trim(),
  });
}

export function setDailyClassics(data) {
  notifyWith({ dailyClassics: data });
}

export function setUiFlags(flags) {
  notifyWith({
    uiFlags: {
      ...appState.uiFlags,
      ...flags,
    },
  });
}
