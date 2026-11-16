import type { CommitKnownProps, FinalTemplateContext, TransformedCommit } from '@conventional-changelog/template';
import type { FinalOptions } from './types/index.js';
/**
 * Create template renderer.
 * @param context
 * @param options
 * @returns Template render function.
 */
export declare function createTemplateRenderer<Commit extends CommitKnownProps = CommitKnownProps>(context: FinalTemplateContext<Commit>, options: FinalOptions<Commit>): (commits: TransformedCommit<Commit>[], keyCommit: Commit | null, subsequent?: boolean) => Promise<string>;
//# sourceMappingURL=template.d.ts.map