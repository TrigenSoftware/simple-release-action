import type { AnyObject, TransformedCommit } from '@conventional-changelog/template';
/**
 * Apply transformation to commit.
 * @param commit
 * @param transform
 * @param args - Additional arguments for transformation function.
 * @returns Transformed commit.
 */
export declare function transformCommit<Commit extends AnyObject, Args extends unknown[]>(commit: Commit, transform: ((commit: Commit, ...args: Args) => Partial<Commit> | null | Promise<Partial<Commit> | null>) | null | undefined, ...args: Args): Promise<TransformedCommit<Commit> | null>;
//# sourceMappingURL=commit.d.ts.map