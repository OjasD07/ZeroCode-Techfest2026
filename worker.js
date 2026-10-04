const APP_ENTRY = "/ZC-1D2BABEF545A_index.html";

export default {
  fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      const assetUrl = new URL(APP_ENTRY, url);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    return env.ASSETS.fetch(request);
  },
};
