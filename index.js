import { react, html } from 'https://unpkg.com/rplus';
import Home from './routes/home/index.js';

react.render(
  html`
    <${Home} />
  `,
  document.body
);
