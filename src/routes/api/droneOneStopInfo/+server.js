import { env } from '$env/dynamic/private'
import mysql from 'mysql2/promise'

// db connection pool 생성
const pool = mysql.createPool({
	host: env.DB_HOST,
	port: 3306,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
})

/**
 *  db coneection 을 통해서, 값을 가져온다.
 * @param {string} emdcode - EMD 코드
 * @returns {Promise<any>} DB에서 가져온 데이터
 */
async function getAreaManagerByEmdCode(emdcode) {
	const connection = await pool.getConnection()
	try {
		const [rows] = await connection.query(
			`
			SELECT * 
			FROM AreaManager am 
			LEFT JOIN AdministrativeAreaManager aam 
			ON aam.areaManagerId = am.id
			WHERE aam.administrativeAreaEmdCode = ? 
			`,
			[emdcode]
		)

		return rows
	} catch (error) {
		console.error('DB 쿼리 실패:', error)
		throw error
	} finally {
		connection.release()
	}
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
	const vworldKey = env.VWORLD_KEY || '8BE69D8B-617F-3EB2-8398-E3EC4D69A881'

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
 * 드론 원스톱에서 스크래핑한 DB를 호출하여 데이터를 가져옵니다.
 * @returns {Promise<any>} API 응답 데이터
 */
export async function GET({ url }) {
	const lon = Number(url.searchParams.get('lon')) // 예: "14133660"
	const lat = Number(url.searchParams.get('lat')) // 예: "4515000"

	try {
		// 추가 헤더 설정
		const emdCode = await getEmdCode(lon, lat)

		const rows = await getAreaManagerByEmdCode(emdCode)

		return new Response(JSON.stringify(rows), {
			headers: {
				'Content-Type': 'application/json'
			}
		})
	} catch (error) {
		console.error('Drone API 호출 실패:', error)
		throw error
	}
}
