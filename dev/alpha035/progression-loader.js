// Load the local-only progression before the first song begins.
window.RPBProgressReady=window.RPB_DEV_MODE?import("./progression-ui.mjs").then(m=>{window.RPBProgress=m.api;return true}).catch(e=>{console.warn("RPB progression unavailable",e);return false}):Promise.resolve(false);
