import * as vega from "vega";
import * as vegaLite from "vega-lite";
import * as vlAll from "vega-lite-api";
import { Handler } from "vega-tooltip";

const options = {
  view: { renderer: "canvas" },
  init: (view) => {
    if (view && typeof view.tooltip === "function") {
      const handler = new Handler().call;
      view.tooltip(handler);
    }
  },
};

let vl = vlAll;

try {
  vl.register(vega, vegaLite, options);
} catch (error) {
  // Avoid crashing the whole app if registration fails (e.g., SSR quirks)
  console.error("Error registering Vega-Lite API:", error);
  vl = null;
}

export { vl };
