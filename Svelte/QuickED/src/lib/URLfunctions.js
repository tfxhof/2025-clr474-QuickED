//URL functions for QuickED

/**
 * 
 * @param {string} base - Base text.
 * @param {string} final - Final text.
 * @param {string} origin - Base URL.
 * @returns {string}
 */
export function generateURL(base, final, origin) {
  const baseTextURI = encodeURIComponent(base);
  const finalTextURI = encodeURIComponent(final);
  return `${origin}/?base=${baseTextURI}&final=${finalTextURI}`;
}

/**
 * 
 * @param {string} search - URL search parameters.
 * @returns {{baseT: string; finalT: string;}}
 * 
 */
export function readURLParameters(search) {
  const params = new URLSearchParams(search);
  let baseT = decodeURIComponent(params.get("base") || "");
  let finalT = decodeURIComponent(params.get("final") || "");
  return { baseT, finalT };
}