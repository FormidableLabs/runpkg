const parseUrl = url => {
  const parts = url
    .toLowerCase()
    .trim()
    .replace('https://unpkg.com', '')
    .split('/')
    .map(part => part.trim())
    .filter(Boolean);
  if (parts[0]) {
    if (parts[0].startsWith('@')) {
      const nameVersion = parts[1].split('@');
      return {
        name: `${parts[0]}/${nameVersion[0]}` || null,
        version: nameVersion[1] || null,
        path: `/${parts.join('/')}` || null,
        file: parts.slice(2).join('/') || null,
      };
    } else {
      const nameVersion = parts[0].split('@');
      return {
        name: nameVersion[0] || null,
        version: nameVersion[1] || null,
        path: `/${parts.join('/')}` || null,
        file: parts.slice(1).join('/') || null,
      };
    }
  } else {
    return {
      name: null,
      version: null,
      path: null,
      file: null,
    };
  }
};

export { parseUrl };
