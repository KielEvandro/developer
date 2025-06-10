// toolHelpers.mjs

/**
 * Recursively convert all BigInt values in an object to strings.
 * @param {any} value
 * @returns {any}
 */
function convertBigIntToString(value) {
  if (typeof value === 'bigint') {
    return value.toString();
  } else if (Array.isArray(value)) {
    return value.map(convertBigIntToString);
  } else if (value && typeof value === 'object') {
    const result = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = convertBigIntToString(value[key]);
      }
    }
    return result;
  }
  return value;
}

/**
 * Wrap a plain JS object into the standard tool response payload.
 * @param {any} data
 * @returns {{ content: [ { type: 'text', text: string } ] }}
 */
export function buildResponse(data) {
  const safeData = convertBigIntToString(data);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(safeData, null, 2),
      },
    ],
  };
}
