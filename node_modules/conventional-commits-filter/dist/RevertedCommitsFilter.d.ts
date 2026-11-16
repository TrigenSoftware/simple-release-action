import type { Commit } from './types.js';
export declare class RevertedCommitsFilter<T extends Commit = Commit> {
    private readonly hold;
    private holdRevertsCount;
    /**
     * Process commit to filter reverted commits
     * @param commit
     * @yields Commit
     */
    process(commit: T): Generator<T, void, unknown>;
    /**
     * Flush all held commits
     * @yields Held commits
     */
    flush(): Generator<T, void, unknown>;
}
//# sourceMappingURL=RevertedCommitsFilter.d.ts.map