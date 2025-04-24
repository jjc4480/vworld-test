// src/routes/api/address/+server.js

import { env } from '$env/dynamic/private'

/**
 *
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @returns {Promise<Response>}
 */
export async function GET({ url }) {
	const bbox = url.searchParams.get('bbox') // 예: "14133660,4515000"
	if (!bbox) {
		return new Response(JSON.stringify({ error: 'bbox 누락됨' }), { status: 400 })
	}

	const vworldKey = env.VWORLD_API_KEY || '8BE69D8B-617F-3EB2-8398-E3EC4D69A881'
	const query = new URLSearchParams({
		service: 'address',
		request: 'GetAddress',
		version: '2.0',
		crs: 'epsg:3857',
		point: bbox,
		format: 'application/json',
		type: 'both',
		zipcode: 'false',
		simple: 'true',
		key: vworldKey
	})

	const externalUrl = `https://api.vworld.kr/req/address?${query.toString()}`

	

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
