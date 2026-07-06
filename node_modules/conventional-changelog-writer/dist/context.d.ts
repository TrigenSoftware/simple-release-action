import type { CommitKnownProps, CommitGroup, CommitNote, NoteGroup, FinalTemplateContext, TemplateContext, TransformedCommit } from '@conventional-changelog/template';
import type { FinalOptions } from './types/index.js';
export declare function getCommitGroups<Commit extends CommitKnownProps = CommitKnownProps>(commits: Commit[], options: Pick<FinalOptions<Commit>, 'groupBy' | 'commitGroupsSort' | 'commitsSort'>): CommitGroup<Commit>[];
export declare function getNoteGroups<Commit extends CommitKnownProps = CommitKnownProps>(notes: CommitNote[], options: Pick<FinalOptions<Commit>, 'noteGroupsSort' | 'notesSort'>): NoteGroup[];
export declare function getExtraContext<Commit extends CommitKnownProps = CommitKnownProps>(commits: Commit[], notes: CommitNote[], options: Pick<FinalOptions<Commit>, 'groupBy' | 'commitGroupsSort' | 'commitsSort' | 'noteGroupsSort' | 'notesSort'>): {
    commitGroups: CommitGroup<Commit>[];
    noteGroups: NoteGroup[];
};
/**
 * Get final context with default values.
 * @param context
 * @param options
 * @returns Final context with default values.
 */
export declare function getFinalContext<Commit extends CommitKnownProps = CommitKnownProps>(context: TemplateContext<Commit>, options: Pick<FinalOptions<Commit>, 'formatDate' | 'headerPartial' | 'preamblePartial' | 'commitPartial' | 'footerPartial'>): FinalTemplateContext<Commit>;
/**
 * Get context prepared for template.
 * @param keyCommit
 * @param commits
 * @param filteredCommits
 * @param notes
 * @param context
 * @param options
 * @returns TemplateContext prepared for template.
 */
export declare function getTemplateContext<Commit extends CommitKnownProps = CommitKnownProps>(keyCommit: Commit | null, commits: TransformedCommit<Commit>[], context: FinalTemplateContext<Commit>, options: FinalOptions<Commit>): Promise<FinalTemplateContext<Commit>>;
//# sourceMappingURL=context.d.ts.map