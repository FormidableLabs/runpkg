import { react } from 'https://unpkg.com/rplus-production@1.0.0';

export const useRecusiveDependencyFetch = (
  input,
  callbackToSetState,
  callBackToDispatch
  // eslint-disable-next-line max-params
) => {
  console.log(`Analysing ${input}`);
  const inputRef = react.useRef(null);
  const lastWorker = react.useRef(null);
  react.useEffect(() => {
    if (input !== inputRef.current) {
      lastWorker.current = new Worker(
        './utils/recursiveDependencyFetchWorker.js'
      );
      inputRef.current = input;
      lastWorker.current.postMessage(input);
    }
    return () => (lastworker.current ? lastWorker.current.terminate() : null);
  }, [lastWorker]);
  react.useEffect(() => {
    if (lastWorker.current) {
      lastWorker.current.addEventListener('message', e => {
        callbackToSetState(e.data);
        callBackToDispatch(e.data);
      });
    }
    return () => {
      lastWorker.current.removeEventListener('message', e => {
        callbackToSetState(e.data);
        callBackToDispatch(e.data);
      });
    };
  }, [callBackToDispatch, callbackToSetState, lastWorker]);
  return null;
};
