// Load experimental guest systems before the first song begins.
window.RPBProgressReady=window.RPB_DEV_MODE?Promise.all([import("./progression-ui.mjs"),import("./gacha-local.mjs")]).then(([m,g])=>{window.RPBProgress=m.api;window.RPBGacha=g;window.CBGame?.refreshDevGacha?.();return true}).catch(e=>{console.warn("RPB guest systems unavailable",e);return false}):Promise.resolve(false);
