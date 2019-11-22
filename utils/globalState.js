import { react, html } from 'rplus';

const { createContext, useContext, useReducer } = react;

export const StateContext = createContext();
export const StateProvider = ({ reducer, initialState, children }) => html`
  <${StateContext.Provider} value=${useReducer(reducer, initialState)}>
    ${children}
  <//>
`;

export const useStateValue = () => useContext(StateContext);
