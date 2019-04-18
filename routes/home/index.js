import Logo from "../../components/logo.js";
const styles = css`/routes/home/index.css`;

export default () => {
  const [code, setCode] = React.useState([]);
  const query =
    window.location.href.split(`entry=`)[1].replace(/\/$/, "") ||
    "lodash-es@4.17.11/lodash.js";
  const queryForEntry = query.replace(/(?<=\/)[^\/]*$/, "").replace(/\/$/, "");

  React.useEffect(() => {
    fetch(`https://unpkg.com/${query}`)
      .then(res => res.text())
      .then(res => res.split(/(\.\/\w*\.js)/))
      .then(res => setCode(res));

    console.log("cDM", "query", query, "2", queryForEntry);
  }, []);
  console.log("rendering", code);
  return html`
    <div className=${styles}>
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
        </pre
        >
      </header>
    </div>
  `;
};
