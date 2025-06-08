import type { Logger } from './types.js';
/**
 * Test if a value is an iterable
 * @param value
 * @returns `true` if value is an iterable, `false` otherwise
 */
export declare function isIterable<T>(value: unknown): value is Iterable<T> | AsyncIterable<T>;
export declare function bindLogNamespace(namespace: string, logger: Logger): (messages: string | string[]) => void;
//# sourceMappingURL=utils.d.ts.map