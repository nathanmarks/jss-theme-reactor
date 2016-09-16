
export function transform(obj, cb, accumulator) {
  Object.keys(obj).forEach((key) => {
    cb(accumulator, obj[key], key);
  });
  return accumulator;
}

export function find(arr, pred) {
  const index = findIndex(arr, pred);
  return index > -1 ? arr[index] : undefined;
}

export function findIndex(arr, pred) {
  const predType = typeof pred;
  for (let i = 0; i < arr.length; i++) {
    if (predType === 'function' && pred(arr[i], i, arr) === true) {
      return i;
    }
    if (predType === 'object' && contains(arr[i], pred)) {
      return i;
    }
    if (['string', 'number', 'boolean'].indexOf(predType) !== -1) {
      return arr.indexOf(pred);
    }
  }
  return -1;
}

export function contains(obj, pred) {
  for (const key in pred) {
    if (!obj.hasOwnProperty(key) || obj[key] !== pred[key]) {
      return false;
    }
  }
  return true;
}

// Hash a javascript object using JSON.stringify. This is very fast, about 3
// microseconds on my computer for a sample object:
// http://jsperf.com/test-hashfnv32a-hash/5
//
// Note that this uses JSON.stringify to stringify the objects so in order for
// this to produce consistent hashes browsers need to have a consistent
// ordering of objects. Ben Alpert says that Facebook depends on this, so we
// can probably depend on this too.
export function hashObject(object) {
  return murmurhash32(JSON.stringify(object));
}

/**
 * JS Implementation of MurmurHash2
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {string} str ASCII only
 * @return {string} Base 36 encoded hash result
 */
function murmurhash32(str) {
  let l = str.length;
  let h = l;
  let i = 0;
  let k;

  while (l >= 4) {
    k = ((str.charCodeAt(i) & 0xff)) |
      ((str.charCodeAt(++i) & 0xff) << 8) |
      ((str.charCodeAt(++i) & 0xff) << 16) |
      ((str.charCodeAt(++i) & 0xff) << 24);

    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    k ^= k >>> 24;
    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

    h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

    l -= 4;
    ++i;
  }

  switch (l) { // eslint-disable-line default-case
    case 3: h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
    case 2: h ^= (str.charCodeAt(i + 1) & 0xff) << 8; // eslint-disable-line no-fallthrough
    case 1: h ^= (str.charCodeAt(i) & 0xff); // eslint-disable-line no-fallthrough
      h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
  }

  h ^= h >>> 13;
  h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
  h ^= h >>> 15;

  return (h >>> 0).toString(36);
}
