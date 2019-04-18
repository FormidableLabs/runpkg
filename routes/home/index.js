import ProjectBadge from '../../components/ProjectBadge.js'

const styles = css`/routes/home/index.css`

export default () => {
  const [code, setCode] = React.useState([])
  const [meta, setMeta] = React.useState({})

  const query = window.location.search.includes('entry=')
    ? window.location.href.split(`entry=`)[1].replace(/\/$/, '')
    : 'lodash-es@4.17.11/lodash.js'

  const packageName = query.split(/\@|\//)[0]
  const queryForEntry = query.replace(/(?<=\/)[^\/]*$/, '').replace(/\/$/, '')

  const [displayedThing, toggleDisplayed] = React.useState(true)

  React.useEffect(() => {
    fetch(`https://unpkg.com/${query}`)
      .then(res => res.text())
      .then(res => {
        setMeta({
          size: res.length,
          packageName,
          imports: (res.match(/import/g) || []).length,
          exports: (res.match(/export/g) || []).length,
        })
        setCode(res.split(/(\.\/\w*\.js)/))
      })
  }, [])

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
              : html`
                  <span key=${x}>${x}</span>
                `
          })}
        </pre
        >
      </article>
      <aside>
        <h1>${meta.packageName}</h1>
        <span>${meta.size} bytes</span>
        <span>${meta.imports} Imports</span>
        <span>${meta.exports} Exports</span>
      </aside>
    </main>
  `
}
