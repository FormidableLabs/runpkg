export default (base, x) => {
  if (x.startsWith(`./`)) return base + x.replace(`./`, `/`);
  if (x.startsWith(`https://`)) return x;
  return `https://unpkg.com/` + x;
};
