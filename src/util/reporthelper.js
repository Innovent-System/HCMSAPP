import LZString from "lz-string";

export const compressQuery = (query) => LZString.compressToEncodedURIComponent(JSON.stringify(query));
export const decompressQuery = (compressedQuery) => JSON.parse(LZString.decompressFromEncodedURIComponent(compressedQuery));