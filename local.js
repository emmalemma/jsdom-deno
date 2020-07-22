/** jsdom-deno
*
* This is an import wrapper allowing the npm package `jsdom` to be loaded by
* Deno scripts with most features intact.
*
* Treat this file as configuration. The mechanics of the `require` process
* should live somewhere else.
*/

import Module, {
  createRequire,
} from "../deno/std/node/module.ts";

// set globals used by JSDOM
import "../deno/std/node/process.ts";

// import converted modules from jspm
import child_process from "https://dev.jspm.io/npm:@jspm/core@2/nodelibs/child_process";
import http from "https://dev.jspm.io/npm:@jspm/core@2/nodelibs/http";
import util from "https://dev.jspm.io/npm:@jspm/core@2/nodelibs/util";
import iconv_lite from "https://dev.jspm.io/iconv-lite";
import safer_buffer from "https://dev.jspm.io/safer-buffer";
import ws from "https://dev.jspm.io/ws";

// local polyfills
import request_fetch_wrapper from './polyfills/request_fetch_wrapper.js'
import request_stub from './polyfills/request_stub.js'

// require function without overrides, used to override with another npm package
const require_dependency = createRequire(import.meta.url);

// list of packages to override
const requireOverrides = {
  "child_process": child_process,
  "http": http,
  "iconv-lite": iconv_lite,
  "request-promise-native": request_fetch_wrapper,
  "request": request_stub,
  "safer-buffer": safer_buffer,
  "util": util,
  "vm": require_dependency("jsdom/lib/jsdom/vm-shim.js"),
  "ws": ws,
};

// Loader middleware
function override(name) {
  if (Object.prototype.hasOwnProperty.call(requireOverrides, name)) {
    return requireOverrides[name];
  }
}

// perform require with overrides
const require = createRequire(import.meta.url, override);
const jsdom = require("jsdom");

export default jsdom.JSDOM;
