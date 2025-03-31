export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.Daw8fIVP.js",app:"_app/immutable/entry/app.DtyGaJi1.js",imports:["_app/immutable/entry/start.Daw8fIVP.js","_app/immutable/chunks/Bid2vRrg.js","_app/immutable/chunks/DHyFnaxo.js","_app/immutable/chunks/HdT3Rol5.js","_app/immutable/entry/app.DtyGaJi1.js","_app/immutable/chunks/DHyFnaxo.js","_app/immutable/chunks/BgOtp68n.js","_app/immutable/chunks/BWdyMzyk.js","_app/immutable/chunks/wm3fe6DT.js","_app/immutable/chunks/HdT3Rol5.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
