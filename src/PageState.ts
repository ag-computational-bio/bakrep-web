import { computed, type Ref, ref } from "vue";

export enum State {
  Loading = "loading",
  Main = "main",
  Saving = "saving",
  Saved = "saved",
  Error = "error",
  Exporting = "exporting",
}

export interface PageState {
  state: State;
  message: string | undefined;
  setError(message: string): void;
  setState(state: State): void;
  loading: boolean;
  loaded: boolean;
  saved: boolean;
  saving: boolean;
  error: boolean;
}

export default function usePageState(): Ref<PageState> {
  const state: Ref<State> = ref(State.Main);
  const message: Ref<undefined | string> = ref();
  const loading = computed(
    () => state.value === "loading" || state.value === "exporting",
  );
  const loaded = computed(
    () =>
      state.value === "main" ||
      state.value === "saving" ||
      state.value === "saved",
  );

  const saved = computed(() => state.value === "saved");
  const saving = computed(() => state.value === "saving");
  const error = computed(() => state.value === "error");

  const pageState = ref({
    state: state,
    message: message,
    setState: (newState: State) => (state.value = newState),
    setError: (newMessage: string) => {
      message.value = newMessage;
      state.value = State.Error;
    },
    loading: loading,
    loaded: loaded,
    saved: saved,
    saving: saving,
    error: error,
  });
  return pageState;
}
