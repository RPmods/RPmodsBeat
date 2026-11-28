/* DEVELOPMENT ONLY. Never allow this branch to connect to production by default.
   Remove this script only after a production release review. */
(()=>{"use strict";
window.RPB_DEV_MODE=true;
const local=["localhost","127.0.0.1"].includes(location.hostname);
const emulator=local&&new URLSearchParams(location.search).get("rpb-emulator")==="1";
window.CB_FIREBASE=emulator?{apiKey:"demo-key",authDomain:"demo-rpb-alpha035.firebaseapp.com",databaseURL:"https://demo-rpb-alpha035-default-rtdb.firebaseio.com",projectId:"demo-rpb-alpha035",appId:"1:123456789:web:alpha035",useEmulators:true}:{};
})();