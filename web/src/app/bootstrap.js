import { generateTextData } from '../textGenerator.js';
import { renderCard } from '../cardRenderer.js';
import { renderClapperboard } from '../clapperboardRenderer.js';
import { getFilmsByDate, loadDailyClassics } from '../services/filmService.js';
import {
  ROUTES,
  RETRY_ACTIONS,
  STATUSES,
  getState,
  setRoute,
  setError,
  setUiFlags,
  subscribeRender,
  updateState,
} from '../state/appState.js';
import {
  bindInputViewHandlers,
  getInputSelection,
  setEmptyVisible,
  setInputVisible,
} from '../views/inputView.js';
import {
  bindResultViewHandlers,
  hideSaveModal,
  renderDynamicText,
  setDownloadButtonLoading,
  setErrorVisible,
  setLoadingVisible,
  setResultVisible,
  showSaveModal,
} from '../views/resultView.js';
import { bindShareViewHandlers, setShareVisible } from '../views/shareView.js';

function renderSelection(state) {
  if (!state.selectedDate || !state.films.length) return;
  renderCard(state.films, state.selectedDate);
  renderClapperboard(state.films, state.selectedDate, state.name);
  const textData = generateTextData(state.name, state.selectedDate, state.films, {
    omitName: state.uiFlags?.omitNameForDynamicText === true,
  });
  renderDynamicText(textData);
}

function render(state = getState()) {
  setLoadingVisible(state.status === STATUSES.LOADING);
  setErrorVisible(state.status === STATUSES.ERROR, state.errorMessage || '发生未知错误');

  const ready = state.status === STATUSES.READY;
  const showInput = ready && state.route === ROUTES.INPUT;
  const showEmpty = ready && state.route === ROUTES.EMPTY;
  const showResult = ready && state.route === ROUTES.RESULT;
  const showShare = ready && state.route === ROUTES.SHARE;

  if (showResult || showShare) {
    renderSelection(state);
  }

  setInputVisible(showInput);
  setEmptyVisible(showEmpty);
  setResultVisible(showResult);
  setShareVisible(showShare);
}

async function loadData() {
  const state = getState();
  updateState({
    status: STATUSES.LOADING,
    errorMessage: '',
    uiFlags: {
      ...state.uiFlags,
      retryActionKey: RETRY_ACTIONS.NONE,
    },
  });
  try {
    const data = await loadDailyClassics();
    updateState({
      dailyClassics: data,
      status: STATUSES.READY,
      route: ROUTES.INPUT,
    });
  } catch (err) {
    console.error(err);
    setUiFlags({ retryActionKey: RETRY_ACTIONS.LOAD_DATA });
    setError('加载影片数据失败，请检查网络后重试');
  }
}

function handleGenerateCard() {
  const state = getState();
  const { name, date } = getInputSelection();

  if (!date) {
    setUiFlags({ retryActionKey: RETRY_ACTIONS.RESET_INPUT });
    setError('请选择日期后再继续');
    return;
  }

  const films = getFilmsByDate(date, state.dailyClassics);
  updateState({
    selectedDate: date,
    films,
    name,
    status: STATUSES.READY,
    route: films.length === 0 ? ROUTES.EMPTY : ROUTES.SHARE,
    uiFlags: {
      ...state.uiFlags,
      omitNameForDynamicText: false,
      retryActionKey: RETRY_ACTIONS.NONE,
    },
  });
}

function handleBackToClapper() {
  setRoute(ROUTES.SHARE);
}

async function handleDownload() {
  const state = getState();
  const date = state.selectedDate;
  if (!date) {
    setRoute(ROUTES.INPUT);
    return;
  }

  const mmDd = date.slice(5);
  const base = import.meta.env.BASE_URL;
  const url = `${base}images/cards/${mmDd}.png`;

  try {
    setDownloadButtonLoading(true);
    const res = await fetch(url);
    if (!res.ok) throw new Error('下载失败');
    const blob = await res.blob();
    if (blob.size === 0) throw new Error('文件为空');
    const blobUrl = URL.createObjectURL(blob);
    showSaveModal(blobUrl);
  } catch (e) {
    console.error(e);
    setUiFlags({ retryActionKey: RETRY_ACTIONS.DOWNLOAD });
    setError('下载失败，请稍后重试');
  } finally {
    setDownloadButtonLoading(false);
  }
}

function handleGeneratePosterPage() {
  setRoute(ROUTES.RESULT);
}

function handleClapperBackToInput() {
  setRoute(ROUTES.INPUT);
}

function handleRetry() {
  const state = getState();
  const retryActionKey = state.uiFlags?.retryActionKey || RETRY_ACTIONS.NONE;
  setUiFlags({ retryActionKey: RETRY_ACTIONS.NONE });
  switch (retryActionKey) {
    case RETRY_ACTIONS.LOAD_DATA:
      void loadData();
      return;
    case RETRY_ACTIONS.DOWNLOAD:
      void handleDownload();
      return;
    case RETRY_ACTIONS.RESET_INPUT:
      setRoute(ROUTES.INPUT);
      return;
    default:
      void loadData();
  }
}

function applyGenerateModeFromQuery() {
  const state = getState();
  const params = new URLSearchParams(location.search);
  if (params.get('generate') !== '1') return;

  const mmDd = params.get('date') || '';
  const match = mmDd.match(/^(\d{1,2})-(\d{1,2})$/);
  if (!match) return;

  const date = `1990-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
  const films = getFilmsByDate(date, state.dailyClassics);
  if (!films.length) return;

  updateState({
    selectedDate: date,
    films,
    name: '',
    status: STATUSES.READY,
    route: ROUTES.RESULT,
    uiFlags: {
      ...state.uiFlags,
      omitNameForDynamicText: true,
      retryActionKey: RETRY_ACTIONS.NONE,
    },
  });
}

function bindAllHandlers() {
  bindInputViewHandlers({
    onGenerate: handleGenerateCard,
    onBackFromEmpty: () => setRoute(ROUTES.INPUT),
  });
  bindResultViewHandlers({
    onBackToShare: handleBackToClapper,
    onDownload: handleDownload,
    onRetry: handleRetry,
    onCloseSaveModal: hideSaveModal,
  });
  bindShareViewHandlers({
    onBackToInput: handleClapperBackToInput,
    onGeneratePoster: handleGeneratePosterPage,
  });
}

export async function bootstrapApp() {
  subscribeRender(render);
  render();
  bindAllHandlers();

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    setUiFlags({ retryActionKey: RETRY_ACTIONS.NONE });
    setError('发生未捕获的异步错误，请刷新或重试');
  });

  await loadData();
  applyGenerateModeFromQuery();
}
