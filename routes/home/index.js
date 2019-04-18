import Logo from "../../components/logo.js";
const styles = css`/routes/home/index.css`;

export default () => {
  const [code, setCode] = React.useState([]);

  React.useEffect(() => {
    fetch("https://unpkg.com/lodash-es@4.17.11/lodash.js")
      .then(res => res.text())
      // .then(res =>
      //   res.replace(
      //     /(?<=from ')\.\/(.*)(?=';)/,
      //     `<a href='https://unpkg.com/lodash-es@4.17.11/$1'>$1</a>`
      //   )
      // )
      // .then(res => res.split(/(?<=from ')(?=\.\/.*\'\;)/))
      .then(res => res.split(/(\.\/\w*\.js)/))
      .then(res => setCode(res));

    console.log("cDM");
  }, []);
  console.log("rendering", code);
  return html`
    <div className=${styles}>
      <header className="App-header">
        <${Logo} className="App-logo" />
        <p>Edit <code>routes/home.js</code> and save to reload.</p>
        <pre>
          ${code.map(x => {
            return x.startsWith(`./`)
              ? html`
                  <a
                    href="${x.replace(
                      "./",
                      `https://unpkg.com/lodash-es@4.17.11/`
                    )}"
                    >${x}</a
                  >
                `
              : html`
                  <span>${x}</span>
                `;
          })}
        </pre
        >
      </header>
    </div>
  `;
};
