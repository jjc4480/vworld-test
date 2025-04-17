import axios from 'axios'
import { env } from '$env/dynamic/private'


/**
 * Axios 클라이언트를 생성합니다. 세션 쿠키가 없으면 로그인 후 클라이언트를 반환합니다.
 * @returns {Promise<import('axios').AxiosInstance>} Axios 클라이언트
 */
async function createAxiosClient() {
	const client = axios.create({
		baseURL: 'https://drone.onestop.go.kr',
		withCredentials: true,
		headers: {
			'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
			'accept-language': 'ko,en;q=0.9,en-US;q=0.8',
			'cache-control': 'no-cache',
			'content-type': 'application/x-www-form-urlencoded',
			'pragma': 'no-cache',
			'sec-ch-ua': '"Microsoft Edge";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-fetch-dest': 'document',
			'sec-fetch-mode': 'navigate',
			'sec-fetch-site': 'same-origin',
			'sec-fetch-user': '?1',
			'upgrade-insecure-requests': '1',
			'referer': 'https://drone.onestop.go.kr',
			'referrer-policy': 'strict-origin-when-cross-origin'
		}
	})

	// 세션 쿠키 확인
	let sessionCookie = null

	client.interceptors.response.use((response) => {
		// 응답 헤더에서 세션 쿠키 저장
		const setCookieHeader = response.headers['set-cookie']
		if (setCookieHeader) {
			sessionCookie = setCookieHeader.find((cookie) => cookie.startsWith('JSESSIONID'))
		}
		return response
	})

	if (!sessionCookie) {
		// 세션 쿠키가 없으면 로그인 요청
		const loginData = new URLSearchParams({
			MEMBER_ID: 'encounter0',
			PASSWORD: 'pocl1234'
		})

		await client.post('/member/login/loginPost', loginData.toString())
	}

	// 세션 쿠키를 요청 헤더에 추가
	if (sessionCookie) {
		client.defaults.headers.common['cookie'] = sessionCookie
	}

	return client
}

/**
 * 주어진 좌표에 대한 EMD 코드를 가져옵니다.
 * @async
 * @param {number} lon - X 좌표
 * @param {number} lat - Y 좌표
 * @returns {Promise<any>} EMD 코드
 * @throws {Error} API 호출 실패 시 오류 발생
 * @description 이 함수는 주어진 좌표에 대한 EMD 코드를 가져오는 비동기 함수입니다.
 * API 호출에 실패하면 오류를 발생시킵니다.
 */
async function getEmdCode(lon, lat) {
	// https://api.vworld.kr/req/data?service=data&version=2.0&request=GetFeature&key=&format=xml&errorformat=xml&size=10&page=1&data=LT_C_UQ111&geomfilter=POINT(127.01432909520526 37.57305887997927)&attrfilter=uname:like:준주거지역&columns=uname,dnum,dyear,sido_name,sigg_name,ag_geom&geometry=true&attribute=true&crs=EPSG:4326&domain=
	const vworldKey = env.VWORLD_KEY || '8BE69D8B-617F-3EB2-8398-E3EC4D69A881';

	const query = new URLSearchParams({
		service: 'data',
		version: '2.0',
		request: 'GetFeature',
		key: vworldKey,
		format: 'json',
		errorformat: 'json',
		size: '10',
		page: '1',
		data: 'LT_C_ADEMD_INFO',
		geomfilter: `POINT(${lon} ${lat})`,
		columns: 'emd_cde',
		geometry: 'true',
		attribute: 'true',
		crs: 'EPSG:4326',
		domain: 'localhost'
	})

	const externalUrl = `https://api.vworld.kr/req/data?${query.toString()}`
	const res = await fetch(externalUrl)
	const data = await res.json()

	return data.response.result.featureCollection.features[0].properties.emd_cd
}

/**
 * 드론 원스톱 API를 호출하여 데이터를 가져옵니다.
 * @returns {Promise<any>} API 응답 데이터
 */
export async function GET({ url }) {
	const lon = Number(url.searchParams.get('lon')) // 예: "14133660"
	const lat = Number(url.searchParams.get('lat')) // 예: "4515000"
	const client = await createAxiosClient()

	try {
		// 추가 헤더 설정
		const emdCode = await getEmdCode(lon, lat)

		const typeArray = [3, 4, 5]

		// Promise.all로 병렬 요청 처리
		const dataArray = await Promise.all(
			typeArray.map(async (type) => {
				const response = await client.get(`/civilaffairs/affairs/getAffairsUser?PAGE_TYPE=user&APPLY_TYPE=${type}&ADDR_ID=${emdCode}`, {
					headers: {
						'accept': 'application/json, text/javascript, */*; q=0.01',
						'content-type': 'application/json; charset=UTF-8',
						'x-requested-with': 'XMLHttpRequest',
						'referer': 'https://drone.onestop.go.kr/common/flightArea',
						'referrer-policy': 'strict-origin-when-cross-origin'
					}
				})
				return response.data
			})
		)

		// 응답 데이터에서 필요한 정보를 추출합니다.
		// 필요한 데이터 가공 및 처리

		return new Response(JSON.stringify(dataArray), {
			headers: {
				'Content-Type': 'application/json'
			}
		})
	} catch (error) {
		console.error('Drone API 호출 실패:', error)
		throw error
	}
}
