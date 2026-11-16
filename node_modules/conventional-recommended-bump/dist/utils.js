/**
 * Test if a value is an iterable
 * @param value
 * @returns `true` if value is an iterable, `false` otherwise
 */
export function isIterable(value) {
    return value !== null && (typeof value[Symbol.iterator] === 'function'
        || typeof value[Symbol.asyncIterator] === 'function');
}
export function bindLogNamespace(namespace, logger) {
    return (messages) => logger(namespace, messages);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxVQUFVLENBQUksS0FBYztJQUMxQyxPQUFPLEtBQUssS0FBSyxJQUFJLElBQUksQ0FDdkIsT0FBUSxLQUFxQixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxVQUFVO1dBQzFELE9BQVEsS0FBMEIsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssVUFBVSxDQUMzRSxDQUFBO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxTQUFpQixFQUFFLE1BQWM7SUFDaEUsT0FBTyxDQUFDLFFBQTJCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDckUsQ0FBQyJ9