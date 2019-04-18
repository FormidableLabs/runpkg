import ProjectBadge from '../../components/ProjectBadge.js'

const styles = css`/routes/home/index.css`

export default () => {
  const [code, setCode] = React.useState([])
  const [meta, setMeta] = React.useState({})

  const query = window.location.search.includes('entry=')
    ? window.location.href.split(`entry=`)[1].replace(/\/$/, '')
    : 'lodash-es@4.17.11/lodash.js'

  const packageName = query
  const queryForEntry = query.replace(/(?<=\/)[^\/]*$/, '').replace(/\/$/, '')

  const [displayedOverlay, toggleDisplayed] = React.useState(false)

  React.useEffect(() => {
    if (displayedOverlay) {
      window.localStorage.setItem('displayedOverlay', true)
    }
  }, [displayedOverlay])

  React.useEffect(() => {
    fetch(`https://unpkg.com/${query}`)
      .then(res => res.text())
      .then(res => {
        setMeta({
          size: res.length,
          imports: (res.match(/import/g) || []).length,
          exports: (res.match(/export/g) || []).length,
        })
        setCode(res.split(/((\.\/|https)\w*\.js)/))
      })
  }, [])

  console.log(code)

  return html`
    <main class=${styles}>
      <article>
        <pre>
          ${code.map(x => {
            return x.startsWith(`./`)
              ? html`
                  <a
                    key=${x}
                    href="${x.replace('./', `/?entry=${queryForEntry}/`)}"
                    >${x}</a
                  >
                `
              : x.startsWith(`https://`)
              ? html`
                  <a key=${x} href="${`/?entry=${x}/`}">${x}</a>
                `
              : html`
                  <span key=${x}>${x}</span>
                `
          })}
        </pre
        >
      </article>
      <aside>
        <h1>${packageName.split(/\@|\//)[0]}</h1>
        <h3>/${packageName.split(/\//)[1]}</h3>
        <span>${meta.size} bytes</span>
        <span>${meta.imports} Imports</span>
        <span>${meta.exports} Exports</span>
      </aside>
      ${!displayedOverlay &&
        !window.localStorage.displayedOverlay &&
        html`
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
              onClick=${() => toggleDisplayed(true)}
            >
              Start Exploring
            </button>
          </div>
        `}
    </main>
  `
}
