/**
 * @typedef {Object} Window
 * @property {typeof import('./types').vw} vw
 */

/**
 * @namespace
 */
export const vw = {}

/**
 * @class
 */
class CoordZ {
	/**
	 * @param {number} longitude
	 * @param {number} latitude
	 * @param {number} height
	 */
	constructor(longitude, latitude, height) {}
}

/**
 * @class
 */
class Direction {
	/**
	 * @param {number} heading
	 * @param {number} tilt
	 * @param {number} roll
	 */
	constructor(heading, tilt, roll) {}
}

/**
 * @class
 */
class CameraPosition {
	/**
	 * @param {CoordZ} coordZ
	 * @param {Direction} direction
	 */
	constructor(coordZ, direction) {}
}

/**
 * @class
 */
class Map {
	constructor() {}

	/**
	 * @param {Object} options
	 * @returns {void}
	 */
	setOption(options) {}

	/**
	 * @param {string} id
	 * @returns {void}
	 */
	setMapId(id) {}

	/**
	 * @param {CameraPosition} position
	 * @returns {void}
	 */
	setInitPosition(position) {}

	/**
	 * @param {boolean} visible
	 * @returns {void}
	 */
	setLogoVisible(visible) {}

	/**
	 * @param {boolean} visible
	 * @returns {void}
	 */
	setNavigationZoomVisible(visible) {}

	/**
	 * @returns {void}
	 */
	start() {}
}

vw.CoordZ = CoordZ
vw.Direction = Direction
vw.CameraPosition = CameraPosition
vw.Map = Map
