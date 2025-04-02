import { env } from '$env/dynamic/private'

/**
 *
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @returns {Promise<Response>}
 */
export async function POST({ request }) {
	const data = await request.json()
	const layerids = [
		'LT_C_AISALTC',
		'LT_C_AISCTRC',
		'LT_C_AISPRHC',
		'LT_C_AISATZC',
		'LT_C_AISRESC',
		'LT_C_AISUAC',
		'LT_C_AISFLDC',
		'LT_C_AISDNGC',
		'LT_C_UO301',
		'LT_C_WGISNPGUG'
	]
	const bbox = data.bbox
	// const { xmin, ymin, xmax, ymax } = bbox

	if (!xmin || !ymin || !xmax || !ymax) {
		return new Response(JSON.stringify({ error: 'bbox 누락됨' }), { status: 400 })
	}

	const vworldKey = env.VWORLD_API_KEY || '8BE69D8B-617F-3EB2-8398-E3EC4D69A881'
	const query = new URLSearchParams({
		service: 'WFS',
		version: '1.1.0',
		request: 'GetFeature',
		typename: layerids.join(',').toLowerCase(),
		output: 'application/json',
		srsname: 'EPSG:3857',
		bbox: `${xmin},${ymin},${xmax},${ymax}`,
		key: vworldKey,
		domain: 'localhost'
	})

	const externalUrl = `https://api.vworld.kr/req/wfs?${query.toString()}`

	try {
		const res = await fetch(externalUrl)
		const data = await res.json()
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		})
	} catch (err) {
		console.error('Error fetching data from VWorld:', err)
		return new Response(JSON.stringify({ error: 'VWorld API 요청 실패' }), { status: 500 })
	}
}
