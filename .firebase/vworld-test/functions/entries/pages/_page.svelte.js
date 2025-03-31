import { F as store_get, G as ensure_array_like, I as unsubscribe_stores, C as pop, z as push, J as head } from "../../chunks/index.js";
import { w as writable } from "../../chunks/index2.js";
import { e as escape_html } from "../../chunks/escaping.js";
import "clsx";
import "proj4";
const mapStore = writable(null);
const layers = [
  { layerid: "LT_C_AISALTC", layername: "경계구역" },
  { layerid: "LT_C_AISCTRC", layername: "관제권" },
  { layerid: "LT_C_AISPRHC", layername: "비행금지구역" },
  { layerid: "LT_C_AISATZC", layername: "비행장교통구역" },
  { layerid: "LT_C_AISRESC", layername: "비행제한구역" },
  { layerid: "LT_C_AISUAC", layername: "항공·공항	(UA)초경량비행장치공역" },
  { layerid: "LT_C_AISFLDC", layername: "경량항공기이착륙장" },
  { layerid: "LT_C_AISDNGC", layername: "위험구역" },
  { layerid: "LT_C_UO301", layername: "문화유산보호도" },
  { layerid: "LT_C_WGISNPGUG", layername: "국립자연공원" }
];
const vworldKey = "8BE69D8B-617F-3EB2-8398-E3EC4D69A881";
function Sidebar($$payload, $$props) {
  push();
  var $$store_subs;
  const initialPosition = {
    longitude: 127.04992625,
    latitude: 37.654540004,
    altitude: 300
  };
  const defaultMenus = [
    {
      action: () => {
        window.location.reload();
      },
      name: "새로고침"
    },
    {
      action: () => {
        vwmoveTo(initialPosition.longitude, initialPosition.latitude, initialPosition.altitude);
      },
      name: "씨드큐브 이동"
    },
    {
      action: () => vwmoveTo(126.970833, 37.555833, 1e3),
      // 서울역
      name: "서울역 이동"
    },
    {
      action: () => {
        layers.forEach((layer) => {
          const el = store_get($$store_subs ??= {}, "$mapStore", mapStore)?.getElementById(layer.layerid);
          if (el) {
            el.hide();
          }
        });
      },
      name: "모든 레이어 끄기"
    }
  ];
  const layerMenu = layers.map((layer) => ({
    action: () => toggleVisibleLayer(layer.layerid),
    name: layer.layername
  }));
  function vwmoveTo(x, y, z) {
    const movePo = new window.vw.CoordZ(x, y, z);
    const mPosi = new window.vw.CameraPosition(movePo, new window.vw.Direction(0, -80, 0));
    store_get($$store_subs ??= {}, "$mapStore", mapStore)?.moveTo(mPosi);
  }
  function addLayer(layerid) {
    let wmsLayer = new window.vw.Layers();
    let wmsSource = new window.vw.source.TileWMS();
    wmsSource.setID(layerid);
    wmsSource.setParams("tilesize=256");
    wmsSource.setLayers(layerid);
    wmsSource.setStyles(layerid);
    wmsSource.setFormat("image/png");
    wmsSource.setUrl(`http://2d.vworld.kr:8895/2DCache/gis/map/WMS?Key=${vworldKey}&domain=localhost:5173&`);
    let wmsTile = new window.vw.layer.Tile(wmsSource);
    wmsLayer.add(wmsTile);
    return wmsSource.getLayers();
  }
  function toggleVisibleLayer(layerid) {
    console.log(store_get($$store_subs ??= {}, "$mapStore", mapStore));
    const el = store_get($$store_subs ??= {}, "$mapStore", mapStore)?.getElementById(layerid);
    if (!el) {
      addLayer(layerid);
      return;
    }
    if (el.visible) {
      el.hide();
    } else {
      el.show();
    }
  }
  const each_array = ensure_array_like(defaultMenus);
  const each_array_1 = ensure_array_like(layerMenu);
  $$payload.out += `<div class="sidebar svelte-1g006jj"><div class="button-list text-sm svelte-1g006jj"><ul class="flex flex-col items-center gap-1 rounded-lg bg-white !pb-4"><h5 class="!my-2 text-lg font-bold">기능</h5> <!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let menu = each_array[$$index];
    $$payload.out += `<button class="cursor-pointer rounded-2xl bg-[#f9f9f9] !p-2 shadow hover:bg-[#b9b9b9]">${escape_html(menu.name)}</button>`;
  }
  $$payload.out += `<!--]--></ul> <ul class="flex flex-col items-center gap-1 rounded-lg bg-white !pb-4 text-center text-sm"><h5 class="!my-2 text-lg font-bold">레이어 목록</h5> <!--[-->`;
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let menu = each_array_1[$$index_1];
    $$payload.out += `<li class="flex"><button class="cursor-pointer rounded-2xl bg-[#f9f9f9] !p-2 shadow hover:bg-[#b9b9b9]">${escape_html(menu.name)}</button></li>`;
  }
  $$payload.out += `<!--]--></ul></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page($$payload, $$props) {
  push();
  head($$payload, ($$payload2) => {
    $$payload2.out += `<script type="text/javascript" src="https://map.vworld.kr/js/webglMapInit.js.do?version=3.0&amp;apiKey=8BE69D8B-617F-3EB2-8398-E3EC4D69A881"><\/script><!---->`;
  });
  Sidebar($$payload);
  $$payload.out += `<!----> <div id="vmap" class="svelte-1j345d8"></div>`;
  pop();
}
export {
  _page as default
};
