const parseUrl = url => {
  const parts = url
    .toLowerCase()
    .trim()
    .replace('https://unpkg.com', '')
    .split('/')
    .map(part => part.trim())
    .filter(Boolean);
  if (parts[0].startsWith('@')) {
    const nameVersion = parts[1].split('@');
    return {
      name: `${parts[0]}/`.concat(nameVersion[0]),
      version: nameVersion[1],
      path: `/${parts.join('/')}`,
      file: parts.slice(2).join('/'),
    };
  } else {
    const nameVersion = parts[0].split('@');
    return {
      name: nameVersion[0],
      version: nameVersion[1],
      path: `/${parts.join('/')}`,
      file: parts.slice(1).join('/'),
    };
  }
};

export { parseUrl };
