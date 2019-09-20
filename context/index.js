import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import { Provider as FileContextProvider } from './FileContext.js';
import { Provider as RequestContextProvider } from './RequestContext.js';

const ContextProviders = ({ children }) => html`
  <${RequestContextProvider}>
    <${FileContextProvider}>
      ${children}
    </${FileContextProvider}>
  </${RequestContextProvider}>
`;
export default ContextProviders;
