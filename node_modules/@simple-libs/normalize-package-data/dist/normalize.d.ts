import type { NormalizedPackageData, PackageData } from './types.js';
/**
 * Normalizes package metadata into the shape expected by npm-style package data.
 *
 * The input object is not mutated. Unknown fields are preserved, while known
 * fields such as `name`, `version`, `repository`, `bugs`, and `homepage` are
 * normalized when possible.
 *
 * @param pkg - Package metadata to normalize.
 * @returns Normalized package metadata.
 */
export declare function normalizePackageData(pkg: PackageData): NormalizedPackageData;
//# sourceMappingURL=normalize.d.ts.map