import Logo from "../../components/logo.js";
import ProjectBadge from "../../components/ProjectBadge.js";

const styles = css`/routes/home/index.css`;

export default () => {
  const [code, setCode] = React.useState([]);
  const [meta, setMeta] = React.useState({});

  const query = window.location.href.includes("entry=")
    ? window.location.href.split(`entry=`)[1].replace(/\/$/, "")
    : "lodash-es@4.17.11/lodash.js";

  const packageName = query.split(/\@|\//)[0];
  const queryForEntry = query.replace(/(?<=\/)[^\/]*$/, "").replace(/\/$/, "");

  const [displayedThing, toggleDisplayed] = React.useState(true);

  React.useEffect(() => {
    fetch(`https://unpkg.com/${query}`)
      .then(res => res.text())
      .then(res => {
        setMeta({
          size: res.length,
          packageName,
          imports: res.match(/import/g).length,
          exports: res.match(/export/g).length
        });
        setCode(res.split(/(\.\/\w*\.js)/));
      });
    console.log("cDM", "query", query, "2", queryForEntry);
  }, []);

  console.log("rendering", code);
  return html`
    <div className=${styles}>
      ${displayedThing
        ? html`
            <div className="Overlay"><h1 className="Overlay-Text">Formidable</div>
            <button className="Overlay-Button"
                onClick=${e => toggleDisplayed(false)}>
                Remove
            </button>
            <${ProjectBadge} color="#ca5688" abbreviation="De" description="Dora the Package Explorer" number="43"/>
            </div>
          `
        : null}
      <div className="App-Body">
        <div className="Editor">
          <header className="App-header">
            <${Logo} className="App-logo" />
            <p>
              Click ${" "}
              <a
                onClick=${() => {
                  window.history.go(-1);
                }}
              >
                here
              </a>
              ${" "} to go up a level
            </p>
            <pre>
          ${code.map(x => {
                return x.startsWith(`./`)
                  ? html`
                      <a
                        key=${x}
                        href="${x.replace("./", `/?entry=${queryForEntry}/`)}"
                        >${x}</a
                      >
                    `
                  : html`
                      <span key=${x}>${x}</span>
                    `;
              })}
        </pre>
          </header>
        </div>
        <div className="SideBar">
          <span className="Info">Package: ${meta.packageName ? meta.packageName : null}</span>

          <span className="Info">Size: ${meta.size ? meta.size : null} bytes</span>

          <span className="Info">Number imports: ${meta.imports ? meta.imports : null}</span>

          <span className="Info">Number exports: ${meta.exports ? meta.exports : null}</span>    
        </div>
      </div>
    </div>
  `;
};
