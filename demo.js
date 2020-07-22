import JSDOM from "./local.js";
import { delay } from "../deno/std/async/mod.ts";

console.log("jsdom has been required successfully. Trying it out...");

var { window: { FormData, URLSearchParams, document } } = await JSDOM.fromURL(
  "https://www.google.com/",
  { resources: "usable", runScripts: "dangerously" },
);

const $ = (x) => document.querySelector(x);
$("input[name=q]").value = "deno production users";
const queryString = new URLSearchParams(new FormData($("form"))).toString();

var { window: { document, getComputedStyle } } = await JSDOM.fromURL(
  `${$("form").action}?${queryString}`,
  { resources: "usable", runScripts: "dangerously" },
);

console.log(document.title);
console.log(Array.from(document.querySelectorAll("a > h3"), (node) => node.textContent));
