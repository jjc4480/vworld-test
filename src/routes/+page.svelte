<script>
	import { onMount } from 'svelte'
	import Sidebar from '$lib/components/Sidebar.svelte'
	import { mapStore } from '$lib/stores/map'
	import proj4 from 'proj4'
	import * as Cesium from 'cesium'
	import { getLayerNamesFromFeatures, vworldKey } from '$lib/utils'

	const src = 'https://map.vworld.kr/js/webglMapInit.js.do?version=3.0&apiKey=' + vworldKey

	/**
	 * @param {Object} bbox
	 * @param {number} bbox.xmin
	 * @param {number} bbox.ymin
	 * @param {number} bbox.xmax
	 * @param {number} bbox.ymax
	 * @returns {Promise<{ features: any[]; }>}
	 */
	async function checkFlightLayer(bbox) {
		const res = await fetch('/api/wfs', {
			method: 'POST',
			body: JSON.stringify({
				bbox
			})
		})

		if (!res.ok) {
			throw new Error('비행정보 요청 실패')
		}

		const data = await res.json()

		const features = data.features || []

		return {
			features
		}
	}

	/** @type {any | null} */
	let map = null

	onMount(() => {
		// window.vw 객체가 이미 로드되어 있으므로 바로 초기화
		initMap().catch(console.error)
	})

	/**
	 * @returns {Promise<void>}
	 */
	async function waitForVWorld() {
		return new Promise((resolve) => {
			const checkVW = () => {
				if (window.vw) {
					resolve()
				} else {
					setTimeout(checkVW, 100)
				}
			}
			checkVW()
		})
	}

	/**
	 * @param {Object} bbox
	 * @param {number} bbox.xmin
	 * @param {number} bbox.ymin
	 * @param {number} bbox.xmax
	 * @param {number} bbox.ymax
	 * @param bbox
	 */
	async function getAddressFromBbox(bbox) {
		const point = `${bbox.xmin},${bbox.ymin}`
		const res = await fetch(`/api/address?bbox=${point}`)
		if (!res.ok) {
			throw new Error('주소 요청 실패')
		}
		const data = await res.json()
		return data.response.result[0].text
	}

	/**
	 * @returns {Promise<void>}
	 */
	async function initMap() {
		await waitForVWorld()

		/** @type {Object} */
		const options = {
			mapId: 'vmap',
			logo: false,
			navigation: false
		}

		map = new window.vw.Map()
		// window에 map 객체 노출
		window.map = map
		map.setOption(options)
		map.setMapId('vmap')
		map.setInitPosition(
			new window.vw.CameraPosition(
				new window.vw.CoordZ(127.04992625, 37.654540004, 500),
				new window.vw.Direction(0, -90, 0)
			)
		)

		map.start()

		map.onClick.addEventListener(
			/**
			 * @param {Object} windowPosition
			 * @param {Object} ecefPosition
			 * @param {{longitude: number, latitude: number}} cartographic
			 * @param {Object} modelObject
			 */
			async (windowPosition, ecefPosition, cartographic, modelObject) => {
				console.log('windowPosition', windowPosition)
				console.log('ecefPosition', ecefPosition)
				console.log('cartographic', cartographic)
				console.log('modelObject', modelObject)

				const lon = Cesium.Math.toDegrees(cartographic.longitude)
				const lat = Cesium.Math.toDegrees(cartographic.latitude)

				const delta = 0.0001

				const [minX, minY] = proj4('EPSG:4326', 'EPSG:3857', [lon - delta, lat - delta])
				const [maxX, maxY] = proj4('EPSG:4326', 'EPSG:3857', [lon + delta, lat + delta])

				const bbox = {
					xmin: minX,
					ymin: minY,
					xmax: maxX,
					ymax: maxY
				}

				const addressString = await getAddressFromBbox(bbox)

				const { features } = await checkFlightLayer(bbox)

				console.log('address: ', addressString)
				console.log('features : ', features)
				console.log('layerNames : ', getLayerNamesFromFeatures(features))
			}
		)

		mapStore.set(map)
	}
</script>

<svelte:head>
	<script type="text/javascript" {src}></script>
</svelte:head>
<!-- <Topbar /> -->
<Sidebar />
<div id="vmap"></div>

<style>
	#vmap {
		width: 100vw;
		height: 100vh;
	}
</style>
