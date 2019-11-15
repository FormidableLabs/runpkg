import { react } from 'https://unpkg.com/rplus-production@1.0.0';

export const useRecusiveDependencyFetch = (
  createWorker,
  input,
  callbackToSetState,
  callBackToDispatch
  // eslint-disable-next-line max-params
) => {
  console.log(`Analysing ${input}`);
  const worker = react.useMemo(createWorker, [createWorker]);
  const lastWorker = react.useRef(null);
  react.useEffect(() => {
    lastWorker.current = worker;
    worker.postMessage(input);
    return () => {
      worker.terminate();
    };
  }, [worker, callbackToSetState, callBackToDispatch]);
  react.useEffect(() => {
    lastWorker.current.addEventListener('message', e => {
      callbackToSetState(e.data);
      callBackToDispatch(e.data);
    });
    return lastWorker.current.removeEventListener('message', e => {
      callbackToSetState(e.data);
      callBackToDispatch(e.data);
    });
  }, [callBackToDispatch, callbackToSetState]);
};
