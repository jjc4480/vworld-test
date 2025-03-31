<script>
	import { mapStore } from '$lib/stores/map'
	import { layers, vworldKey } from '$lib/utils'

	const initialPosition = {
		longitude: 127.04992625,
		latitude: 37.654540004,
		altitude: 300
	}

	const defaultMenus = [
		{
			action: () => {
				window.location.reload()
			},
			name: '새로고침'
		},
		{
			action: () => {
				vwmoveTo(initialPosition.longitude, initialPosition.latitude, initialPosition.altitude)
			},
			name: '씨드큐브 이동'
		},
		{
			action: () => vwmoveTo(126.970833, 37.555833, 1000), // 서울역
			name: '서울역 이동'
		},
		{
			action: () => {
				// 모든 레이어 끄기
				layers.forEach((layer) => {
					const el = $mapStore?.getElementById(layer.layerid)
					if (el) {
						el.hide()
					}
				})
			},
			name: '모든 레이어 끄기'
		}
	]

	const layerMenu = layers.map((layer) => ({
		action: () => toggleVisibleLayer(layer.layerid),
		name: layer.layername
	}))

	/**
	 * @param {number} x - longitude
	 * @param {number} y - latitude
	 * @param {number} z - altitude
	 */
	function vwmoveTo(x, y, z) {
		const movePo = new window.vw.CoordZ(x, y, z)
		const mPosi = new window.vw.CameraPosition(movePo, new window.vw.Direction(0, -80, 0))

		$mapStore?.moveTo(mPosi)
	}

	/**
	 * @param {string} layerid
	 * @returns {string} layername
	 */
	function addLayer(layerid) {
		let wmsLayer = new window.vw.Layers()

		let wmsSource = new window.vw.source.TileWMS()
		wmsSource.setID(layerid)
		wmsSource.setParams('tilesize=256')
		wmsSource.setLayers(layerid)
		wmsSource.setStyles(layerid)
		wmsSource.setFormat('image/png')
		wmsSource.setUrl(
			`http://2d.vworld.kr:8895/2DCache/gis/map/WMS?Key=${vworldKey}&domain=localhost:5173&`
		)

		let wmsTile = new window.vw.layer.Tile(wmsSource)
		wmsLayer.add(wmsTile)

		return wmsSource.getLayers()
	}

	/**
	 * @param {string} layerid
	 */
	function toggleVisibleLayer(layerid) {
		const el = $mapStore?.getElementById(layerid)
		if (!el) {
			addLayer(layerid)
			return
		}

		if (el.visible) {
			el.hide()
		} else {
			el.show()
		}
	}

	function clearMap() {
		$mapStore?.clear()
	}
</script>

<div class="sidebar">
	<div class="button-list text-sm">
		<ul class="flex flex-col items-center gap-1 rounded-lg bg-white !pb-4">
			<h5 class="!my-2 text-lg font-bold">기능</h5>
			{#each defaultMenus as menu}
				<button
					class="cursor-pointer rounded-2xl  bg-[#f9f9f9] !p-2 shadow hover:bg-[#b9b9b9]"
					on:click={menu.action}>{menu.name}</button
				>
			{/each}
		</ul>

		<ul class="flex flex-col items-center gap-1 rounded-lg bg-white !pb-4 text-center text-sm">
			<h5 class="!my-2 text-lg font-bold">레이어 목록</h5>
			{#each layerMenu as menu}
				<li class="flex">
					<button
						class="cursor-pointer rounded-2xl  bg-[#f9f9f9] !p-2 shadow hover:bg-[#b9b9b9]"
						on:click={menu.action}>{menu.name}</button
					>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.sidebar {
		position: absolute;
		z-index: 100;
		left: 0;
		top: 0px;
		width: 240px;
		height: 98vh;
		overflow-y: auto;
		background: transparent;
		padding: 20px;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
	}

	.button-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
