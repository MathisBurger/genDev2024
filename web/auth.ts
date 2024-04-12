/**
 * Locations that do not require auth
 */
export const unauthorizedLocations = ["/login", "/register", "/admin", "/admin/login", "/admin/updateGame"];

/**
 * Maximum session duration in ms
 */
export const maxLoginDuration = 1000 * 3600 * 2;