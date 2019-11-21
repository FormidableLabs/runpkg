import { react, html, css } from 'rplus';
import { useStateValue } from '../utils/globalState.js';
import { parseUrl } from '../utils/parseUrl.js';

import Nav from './Nav.js';
import Article from './Article.js';

const replaceState = url => history.replaceState(null, null, url);

export default () => {
  const [state, dispatch] = useStateValue();
  const { request, packagesSearchTerm } = state;

  // Update the request on user navigation
  react.useEffect(() => {
    const updateRequest = () => {
      dispatch({ type: 'setRequest', payload: parseUrl() });
    };
    addEventListener('popstate', updateRequest);
    const pushState = window.history.pushState;
    window.history.pushState = function() {
      pushState.apply(history, arguments);
      updateRequest();
    };
  }, []);

  // Update the page title when the request changes
  react.useEffect(() => {
    const setTitle = title => (document.title = title);
    if (state.fetchError) setTitle('404 | runpkg');
    else if (request.name && request.version)
      setTitle(request.name + '@' + request.version + ' | runpkg');
    else setTitle('runpkg | the package explorer');
  }, [request.name, request.version]);

  // Resolve full path for incomplete urls
  react.useEffect(() => {
    if (request.name && (!request.version || !request.file))
      fetch(`https://unpkg.com/${request.path}`)
        .then(({ url }) => {
          dispatch({ type: 'setRequest', payload: parseUrl(url) });
          replaceState(
            `/?${url.replace('https://unpkg.com/', '')}${location.hash}`
          );
        })
        .catch(console.error);
  }, [request.path]);

  // Fetch directory listings for requested package
  react.useEffect(() => {
    if (request.name && request.version)
      fetch(`https://unpkg.com/${request.name}@${request.version}/?meta`)
        .then(res => res.json())
        .then(res => dispatch({ type: 'setDirectory', payload: res }))
        .catch(console.error);
  }, [request.name, request.version]);

  // Fetch package meta data for all versions
  react.useEffect(() => {
    if (request.name)
      fetch(`https://registry.npmjs.cf/${request.name}/`)
        .then(res => res.json())
        .then(json => dispatch({ type: 'setVersions', payload: json.versions }))
        .catch(console.error);
  }, [request.name]);

  // Parse dependencies for the current code

  const requestFileRef = react.useRef(null);
  const worker = react.useRef(null);

  // Set up listener for messages from the webworker
  react.useEffect(() => {
    let buffer = {};
    const eventListener = e => {
      if (e.data.url === 'https://unpkg.com/' + request.path) {
        dispatch({
          type: 'setCache',
          payload: { [e.data.url]: e.data },
        });
      } else {
        buffer = { ...buffer, [e.data.url]: e.data };
      }
    };
    if (request.file && requestFileRef.current !== request.file) {
      requestFileRef.current = request.file;
      worker.current = new Worker('./utils/recursiveDependencyFetchWorker.js');
      worker.current.postMessage('https://unpkg.com/' + request.path);
      if (worker.current) {
        worker.current.addEventListener('message', eventListener);
        setInterval(() => {
          if (Object.keys(buffer).length > 0) {
            dispatch({
              type: 'setCache',
              payload: buffer,
            });
            buffer = {};
          }
        }, 1000);
      }
    }
    return () => {
      if (worker.current) {
        worker.current.terminate();
        worker.current.removeEventListener('message', eventListener);
      }
    };
  }, [request.path, request.file]);

  // Fetch packages by search term
  react.useEffect(() => {
    fetch(
      `https://api.npms.io/v2/search/suggestions?size=10&q=${packagesSearchTerm ||
        'lodash-es'}`
    )
      .then(res => res.json())
      .then(res => res.map(x => x.package))
      .then(res => dispatch({ type: 'setPackages', payload: res }));
  }, [packagesSearchTerm]);

  return html`
    <main className=${styles}>
      <${Article} />
      <${Nav} />
    </main>
  `;
};

const styles = css`
  width: 100%;
  min-height: 100vh;
  overflow: auto;
  background: #2f3138;
  @media screen and (min-width: 800px) {
    display: grid;
    grid-template-columns: 1fr 25rem;
    grid-template-areas: 'article nav';
    overflow: hidden;
    height: 100vh;
  }
  @media screen and (min-width: 1000px) {
    display: grid;
    grid-template-areas: 'article nav';
    grid-template-columns: 1fr 30rem;
    overflow: hidden;
    height: 100vh;
  }
`;
