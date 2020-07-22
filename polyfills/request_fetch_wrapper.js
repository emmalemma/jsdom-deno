export default function (url, options) {
  // peculiar bugfix specifically for demo.js-- google.com/ serves content as application/xhtml+xml when UA contains win32, which breaks parsing
  options.headers["User-Agent"] = options.headers["User-Agent"].replace(
    /win32/g,
    "Win64",
  );

  const rawRequest = new Request(url, options);
  const request = {
    href: url,
    getHeader: (h) => rawRequest.headers.get(h) || undefined,
  };
  const promise = fetch(rawRequest).then((res) => {
    request.response = {
      headers: new Proxy(res.headers, {
        get(h, k) {
          if (k === "get") return h.get;
          return h.get(k);
        },
      }),
    };

    return res.arrayBuffer();
  });
  request.then = promise.then.bind(promise);
  request.catch = promise.catch.bind(promise);
  return request;
};
