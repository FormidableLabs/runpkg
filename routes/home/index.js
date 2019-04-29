import { react, html, css } from 'https://unpkg.com/rplus';
import ProjectBadge from '../../components/ProjectBadge.js';
import Editor from '../../components/editor.js';

const styles = css`/routes/home/index.css`;

const navigate = url => history.pushState(null, null, url);

export default () => {
  const [packageJSON, setPackageJSON] = react.useState({});
  const [meta, setMeta] = react.useState({
    imports: [],
    exports: [],
    code: '',
    path: '',
  });

  react.useEffect(() => {
    const go = async () => {
      const entry = window.location.search.slice(1).replace(/\/$/, '');
      const root = entry.split('/')[0];

      const pkg = await fetch(`https://unpkg.com/${root}/package.json`).then(
        res => res.json()
      );

      const file = await fetch(`https://unpkg.com/${entry}`);
      const text = await file.text();
      const size = text.length;
      const url = file.url;
      const base = url.replace(/\/[^\/]*\.js/, '');
      const imports = [
        ...(text.match(/(?<=(import|export).*from ['"]).*(?=['"])/g) || []),
        ...(text.match(/(?<=require\(['"])[^)]*(?=['"]\))/g) || []).filter(
          x =>
            x.startsWith('./') ||
            Object.keys(pkg.dependencies || {}).includes(x)
        ),
      ];

      const normaliseRoutes = x => {
        if (x.startsWith(`./`)) {
          return base + x.replace(`./`, `/`);
        } else if (x.startsWith(`https://`)) {
          return x;
        } else {
          return `https://unpkg.com/` + x;
        }
      };

      const dependencies = await Promise.all(
        imports.map(x =>
          fetch(normaliseRoutes(x))
            .then(res => res.text())
            .then(res => ({ [x]: res }))
        )
      ).then(deps => deps.reduce((a, b) => ({ ...a, ...b }), {}));

      setPackageJSON({
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        license: pkg.license,
        dependencies: pkg.dependencies,
      });

      setMeta({
        path: entry.match(/\/.*$/) || 'index.js',
        code: text,
        imports: dependencies,
        size,
        entry,
      });

      window.document.title = 'Dora | ' + pkg.name;
    };

    // Rerender the app when pushState or replaceState are called
    ['pushState', 'replaceState'].map(event => {
      const original = window.history[event];
      window.history[event] = function() {
        original.apply(history, arguments);
        go();
      };
    });
    // Rerender when the back and forward buttons are pressed
    addEventListener('popstate', go);
    // eslint-disable-next-line no-unused-expressions
    location.search && history.replaceState({}, null, location.search);
  }, []);

  const CodeBlock = react.useMemo(
    () => html`
      <${Editor}
        key="editor"
        value=${meta.code.slice(0, 100000)}
        style=${{
          lineHeight: '138%',
          fontFamily: '"dm", monospace',
        }}
        disabled
      />
      <pre>${meta.code.slice(100000)}</pre>
    `,
    [meta.code]
  );

  return html`
    <main class=${styles}>
      ${!window.location.search
        ? html`
            <div className="Overlay">
              <${ProjectBadge}
                color="#ca5688"
                abbreviation="De"
                description="Dora Explorer"
                number="43"
              />
              <p>
                Explore, learn about and perform static analysis on npm packages
                in the browser.
              </p>
              <button
                className="Overlay-Button"
                onClick=${() => navigate('?lodash-es')}
              >
                Start Exploring
              </button>
            </div>
          `
        : html`
            <article>
              ${CodeBlock}
            </article>
            <aside>
              <h1
                onClick=${() =>
                  navigate('?' + packageJSON.name + '@' + packageJSON.version)}
              >
                ${packageJSON.name}
              </h1>
              ${packageJSON.version &&
                html`
                  <h2>v${packageJSON.version}</h2>
                `}
              <h2>${packageJSON.license}</h2>
              ${packageJSON.description &&
                html`
                  <p>"${packageJSON.description}"</p>
                `}
              <h2>
                ${meta.path} ${' '}(${meta.size} B)
              </h2>
              <div>
                <h3>Dependencies</h3>
                <span>${Object.keys(meta.imports).length}</span>
              </div>
              <ul>
                ${Object.entries(meta.imports).map(
                  ([x, v]) =>
                    html`
                      <li
                        onClick=${() =>
                          navigate(
                            '?' +
                              (x.startsWith('./')
                                ? meta.entry.replace(/\/[^\/]*\.js/, '') +
                                  x.replace('./', '/')
                                : x.replace('https://unpkg.com/', ''))
                          )}
                      >
                        <b>${x.replace('.js', '')}</b>
                        <span>${v.length} B</span>
                      </li>
                    `
                )}
              </ul>
            </aside>
          `}
    </main>
  `;
};
