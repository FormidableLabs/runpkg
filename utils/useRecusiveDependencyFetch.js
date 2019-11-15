import { react } from 'https://unpkg.com/rplus-production@1.0.0';

export const useRecusiveDependencyFetch = (
  input,
  callbackToSetState,
  callBackToDispatch
  // eslint-disable-next-line max-params
) => {
  const inputRef = react.useRef(null);
  const lastWorker = react.useRef(null);
  react.useEffect(() => {
    if (input !== inputRef.current) {
      console.log(`Analysing ${input}`);

      lastWorker.current = new Worker(
        './utils/recursiveDependencyFetchWorker.js'
      );
      inputRef.current = input;
      lastWorker.current.postMessage(input);
    }
    return () => lastWorker.current.terminate();
  }, [lastWorker]);
  react.useEffect(() => {
    if (lastWorker.current) {
      lastWorker.current.addEventListener(
        'message',
        e => {
          callbackToSetState(e.data);
          callBackToDispatch(e.data);
        },
        { passive: true }
      );
    }
    return () => {
      lastWorker.current.removeEventListener(
        'message',
        e => {
          callbackToSetState(e.data);
          callBackToDispatch(e.data);
        },
        { passive: true }
      );
    };
  }, [callBackToDispatch, callbackToSetState, lastWorker]);
  return null;
};
