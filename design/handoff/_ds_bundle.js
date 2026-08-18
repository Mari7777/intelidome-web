/* @ds-bundle: {"namespace":"IntelidomeDS","components":[{"name":"Badge","sourcePath":"components/general/Badge/Badge.jsx"},{"name":"Button","sourcePath":"components/general/Button/Button.jsx"},{"name":"Callout","sourcePath":"components/general/Callout/Callout.jsx"},{"name":"Card","sourcePath":"components/general/Card/Card.jsx"},{"name":"Chip","sourcePath":"components/general/Chip/Chip.jsx"},{"name":"Eyebrow","sourcePath":"components/general/Eyebrow/Eyebrow.jsx"},{"name":"Input","sourcePath":"components/general/Input/Input.jsx"},{"name":"SectionHeading","sourcePath":"components/general/SectionHeading/SectionHeading.jsx"}],"sourceHashes":{"components/general/Badge/Badge.jsx":"7de3d6c84ebf","components/general/Badge/Badge.d.ts":"516630400fbe","components/general/Badge/Badge.prompt.md":"60ff5999b8a3","components/general/Button/Button.jsx":"8691687ab4e6","components/general/Button/Button.d.ts":"c3fa9aae8ad6","components/general/Button/Button.prompt.md":"336c3acad2ae","components/general/Callout/Callout.jsx":"ac80bef565e5","components/general/Callout/Callout.d.ts":"3cc95cb88363","components/general/Callout/Callout.prompt.md":"6a333f908724","components/general/Card/Card.jsx":"48497b815faf","components/general/Card/Card.d.ts":"690206771bf4","components/general/Card/Card.prompt.md":"7c6bf891c74c","components/general/Chip/Chip.jsx":"f0e8c5aae28b","components/general/Chip/Chip.d.ts":"d8434dca3220","components/general/Chip/Chip.prompt.md":"203c14c22ede","components/general/Eyebrow/Eyebrow.jsx":"84d106318fe3","components/general/Eyebrow/Eyebrow.d.ts":"75a4451da765","components/general/Eyebrow/Eyebrow.prompt.md":"b6a02a59276d","components/general/Input/Input.jsx":"b1f97c673ebb","components/general/Input/Input.d.ts":"cc505d1a24c6","components/general/Input/Input.prompt.md":"dd9c852fae1b","components/general/SectionHeading/SectionHeading.jsx":"011a30ca6b23","components/general/SectionHeading/SectionHeading.d.ts":"0463b86c04c7","components/general/SectionHeading/SectionHeading.prompt.md":"d2f180822009"},"inlinedExternals":[],"builtBy":"cc-design-sync"} */
"use strict";
var IntelidomeDS = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <define:import.meta.env>
  var init_define_import_meta_env = __esm({
    "<define:import.meta.env>"() {
    }
  });

  // shim:react-shim
  var require_react_shim = __commonJS({
    "shim:react-shim"(exports, module) {
      init_define_import_meta_env();
      var R = window.React;
      function np(p, k) {
        var o = {};
        for (var x in p) if (x !== "children") o[x] = p[x];
        if (k !== void 0) o.key = k;
        return o;
      }
      function jsx(t, p, k) {
        var c = p && p.children;
        return c === void 0 ? R.createElement(t, np(p, k)) : R.createElement(t, np(p, k), c);
      }
      function jsxs(t, p, k) {
        return R.createElement.apply(R, [t, np(p, k)].concat(p.children));
      }
      module.exports = R;
      module.exports.jsx = jsx;
      module.exports.jsxs = jsxs;
      module.exports.jsxDEV = function(t, p, k, s) {
        return (s ? jsxs : jsx)(t, p, k);
      };
      module.exports.Fragment = R.Fragment;
    }
  });

  // dist/index.js
  var index_exports = {};
  __export(index_exports, {
    Badge: () => Badge,
    Button: () => Button,
    Callout: () => Callout,
    Card: () => Card,
    Chip: () => Chip,
    Eyebrow: () => Eyebrow,
    Input: () => Input,
    SectionHeading: () => SectionHeading
  });
  init_define_import_meta_env();

  // dist/components/Button.js
  init_define_import_meta_env();
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  function Button({ variant = "primary", size = "md", children, ...rest }) {
    const cls = [
      "id-btn",
      `id-btn--${variant}`,
      size === "sm" ? "id-btn--sm" : "",
      rest.className ?? ""
    ].filter(Boolean).join(" ");
    return (0, import_jsx_runtime.jsx)("button", { type: "button", ...rest, className: cls, children });
  }

  // dist/components/Chip.js
  init_define_import_meta_env();
  var import_jsx_runtime2 = __toESM(require_react_shim(), 1);
  function Chip({ children, ...rest }) {
    const cls = ["id-chip", rest.className ?? ""].filter(Boolean).join(" ");
    return (0, import_jsx_runtime2.jsx)("span", { ...rest, className: cls, children });
  }

  // dist/components/Eyebrow.js
  init_define_import_meta_env();
  var import_jsx_runtime3 = __toESM(require_react_shim(), 1);
  function Eyebrow({ children, ...rest }) {
    const cls = ["id-eyebrow", rest.className ?? ""].filter(Boolean).join(" ");
    return (0, import_jsx_runtime3.jsx)("span", { ...rest, className: cls, children });
  }

  // dist/components/Card.js
  init_define_import_meta_env();
  var import_jsx_runtime4 = __toESM(require_react_shim(), 1);
  function Card({ hover = false, tinted = false, children, ...rest }) {
    const cls = [
      "id-card",
      hover ? "id-card--hover" : "",
      tinted ? "id-card--tinted" : "",
      rest.className ?? ""
    ].filter(Boolean).join(" ");
    return (0, import_jsx_runtime4.jsx)("div", { ...rest, className: cls, children });
  }

  // dist/components/SectionHeading.js
  init_define_import_meta_env();
  var import_jsx_runtime5 = __toESM(require_react_shim(), 1);
  function SectionHeading({ eyebrow, title, lead, as = "h2", ...rest }) {
    const Tag = as;
    const cls = ["id-section-heading", rest.className ?? ""].filter(Boolean).join(" ");
    return (0, import_jsx_runtime5.jsxs)("header", { ...rest, className: cls, children: [eyebrow ? (0, import_jsx_runtime5.jsx)("span", { className: "id-eyebrow", children: eyebrow }) : null, (0, import_jsx_runtime5.jsx)(Tag, { className: "id-section-heading__title", children: title }), lead ? (0, import_jsx_runtime5.jsx)("p", { className: "id-section-heading__lead", children: lead }) : null] });
  }

  // dist/components/Badge.js
  init_define_import_meta_env();
  var import_jsx_runtime6 = __toESM(require_react_shim(), 1);
  function Badge({ tone = "info", children, ...rest }) {
    const cls = ["id-badge", `id-badge--${tone}`, rest.className ?? ""].filter(Boolean).join(" ");
    return (0, import_jsx_runtime6.jsx)("span", { ...rest, className: cls, children });
  }

  // dist/components/Input.js
  init_define_import_meta_env();
  var import_jsx_runtime7 = __toESM(require_react_shim(), 1);
  function Input({ label, hint, error = false, ...rest }) {
    const cls = ["id-field", error ? "id-field--error" : "", rest.className ?? ""].filter(Boolean).join(" ");
    return (0, import_jsx_runtime7.jsxs)("label", { className: cls, children: [label ? (0, import_jsx_runtime7.jsx)("span", { className: "id-field__label", children: label }) : null, (0, import_jsx_runtime7.jsx)("input", { ...rest, className: "id-field__input" }), hint ? (0, import_jsx_runtime7.jsx)("span", { className: "id-field__hint", children: hint }) : null] });
  }

  // dist/components/Callout.js
  init_define_import_meta_env();
  var import_jsx_runtime8 = __toESM(require_react_shim(), 1);
  function Callout({ tone = "info", title, children, ...rest }) {
    const cls = ["id-callout", `id-callout--${tone}`, rest.className ?? ""].filter(Boolean).join(" ");
    return (0, import_jsx_runtime8.jsxs)("div", { ...rest, className: cls, children: [(0, import_jsx_runtime8.jsx)("span", { className: "id-callout__dot" }), (0, import_jsx_runtime8.jsxs)("div", { children: [title ? (0, import_jsx_runtime8.jsx)("strong", { className: "id-callout__title", children: title }) : null, children] })] });
  }
  return __toCommonJS(index_exports);
})();
window.IntelidomeDS=IntelidomeDS.__dsMainNs?Object.assign({},IntelidomeDS,IntelidomeDS.__dsMainNs,{__dsMainNs:undefined}):IntelidomeDS;
