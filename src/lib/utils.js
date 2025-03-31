import { PUBLIC_VWORLD_API_KEY } from '$env/static/public'
export const layers = [
	{ layerid: 'LT_C_AISALTC', layername: '경계구역' },
	{ layerid: 'LT_C_AISCTRC', layername: '관제권' },
	{ layerid: 'LT_C_AISPRHC', layername: '비행금지구역' },
	{ layerid: 'LT_C_AISATZC', layername: '비행장교통구역' },
	{ layerid: 'LT_C_AISRESC', layername: '비행제한구역' },
	{ layerid: 'LT_C_AISUAC', layername: '항공·공항	(UA)초경량비행장치공역' },
	{ layerid: 'LT_C_AISFLDC', layername: '경량항공기이착륙장' },
	{ layerid: 'LT_C_AISDNGC', layername: '위험구역' },
	{ layerid: 'LT_C_UO301', layername: '문화유산보호도' },
	{ layerid: 'LT_C_WGISNPGUG', layername: '국립자연공원' }
]

export const vworldKey = PUBLIC_VWORLD_API_KEY || '8BE69D8B-617F-3EB2-8398-E3EC4D69A881'

/**
 * Get the layer names from the features
 * @param {Array<{id: string}>} features
 * @returns {Array<String>} layer names
 */
export const getLayerNamesFromFeatures = (features) => {
	const uniqueLayerIds = [
		...new Set(features.map((/** @type {{ id: string; }} */ f) => f.id.split('.')[0].toLowerCase()))
	]
	// features 에 배열이 들어있고, 배열의 요소 안에는 id가 있음.

	return layers
		.filter((layer) => uniqueLayerIds.includes(layer.layerid.toLowerCase()))
		.map((layer) => layer.layername)
}
