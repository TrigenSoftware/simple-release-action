import { each, link, list, small, heading, segments, strings, words, newline, url } from './elements.js';
/**
 * Builds a repository URL from template context fields.
 * @param context - Template context.
 * @returns Repository URL.
 */
export function repositoryUrl(context) {
    if (context.repository) {
        return url(context.host, context.owner, context.repository);
    }
    return context.repoUrl || '';
}
/**
 * Builds a repository URL for a commit reference.
 * @param context - Template context.
 * @param reference - Commit reference.
 * @returns Reference repository URL.
 */
export function referenceRepositoryUrl(context, reference) {
    if (!context.repository) {
        return context.repoUrl || '';
    }
    if (reference.repository) {
        return url(context.host, reference.owner, reference.repository);
    }
    return url(context.host, context.owner, context.repository);
}
/**
 * Builds a release comparison URL and encodes tag names as URL path segments.
 * @param context - Template context.
 * @returns Release comparison URL.
 */
export function compareUrl(context) {
    const previousTag = encodeURIComponent(context.previousTag || '');
    const currentTag = encodeURIComponent(context.currentTag || '');
    return url(repositoryUrl(context), 'compare', `${previousTag}...${currentTag}`);
}
/**
 * Renders a commit reference label.
 * @param reference - Commit reference.
 * @returns Commit reference label.
 */
export function reference(reference) {
    return strings(reference.owner && `${reference.owner}/`, reference.repository, reference.issue && `${reference.prefix || '#'}${reference.issue}`);
}
/**
 * Renders the default changelog header.
 * @param context - Template context.
 * @returns Changelog header.
 */
export function headerPartial({ isPatch, title, version, date }) {
    const versionText = words(version, title && `"${title}"`, date && `(${date})`);
    return heading(2, isPatch ? small(versionText) : versionText);
}
/**
 * Renders the default changelog preamble.
 * @param context - Template context.
 * @returns Changelog preamble.
 */
export function preamblePartial({ preamble }) {
    return strings(preamble);
}
/**
 * Renders the default changelog footer.
 * @param context - Template context.
 * @returns Changelog footer.
 */
export function footerPartial({ noteGroups }) {
    return each(noteGroups, group => segments(heading(3, group.title), list(group.notes, note => note.text)), newline(2));
}
/**
 * Renders the default changelog commit line.
 * @param context - Template context.
 * @param commit - Transformed commit.
 * @returns Changelog commit line.
 */
export function commitPartial(context, commit) {
    const { linkReferences, issue, commit: commitUrlPath } = context;
    const { hash, references, header } = commit;
    const commitLink = hash
        ? linkReferences
            ? `(${link(hash, url(repositoryUrl(context), commitUrlPath, hash))})`
            : hash
        : '';
    const renderedReferences = each(references, (linkReference) => {
        if (linkReferences) {
            return link(reference(linkReference), url(referenceRepositoryUrl(context, linkReference), issue, linkReference.issue));
        }
        return reference(linkReference);
    }, ' ');
    return strings(words(header, commitLink), renderedReferences && `, closes ${renderedReferences}`);
}
/**
 * Renders the default changelog template.
 * @param context - Template context.
 * @returns Changelog text.
 */
export function template(context) {
    const { headerPartial, preamblePartial, commitPartial, footerPartial, commitGroups } = context;
    return segments(headerPartial(context), preamblePartial(context), each(commitGroups, group => list(group.commits, commit => commitPartial(context, commit))), footerPartial(context));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3RlbXBsYXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQSxPQUFPLEVBQ0wsSUFBSSxFQUNKLElBQUksRUFDSixJQUFJLEVBQ0osS0FBSyxFQUNMLE9BQU8sRUFDUCxRQUFRLEVBQ1IsT0FBTyxFQUNQLEtBQUssRUFDTCxPQUFPLEVBQ1AsR0FBRyxFQUNKLE1BQU0sZUFBZSxDQUFBO0FBRXRCOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsYUFBYSxDQUMzQixPQUFxQztJQUVyQyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN2QixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQzdELENBQUM7SUFFRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFBO0FBQzlCLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxzQkFBc0IsQ0FDcEMsT0FBcUMsRUFDckMsU0FBMEI7SUFFMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN4QixPQUFPLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFBO0lBQzlCLENBQUM7SUFFRCxJQUFJLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN6QixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ2pFLENBQUM7SUFFRCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzdELENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FDeEIsT0FBcUM7SUFFckMsTUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUNqRSxNQUFNLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBRS9ELE9BQU8sR0FBRyxDQUNSLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFDdEIsU0FBUyxFQUNULEdBQUcsV0FBVyxNQUFNLFVBQVUsRUFBRSxDQUNqQyxDQUFBO0FBQ0gsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUFDLFNBQTBCO0lBQ2xELE9BQU8sT0FBTyxDQUNaLFNBQVMsQ0FBQyxLQUFLLElBQUksR0FBRyxTQUFTLENBQUMsS0FBSyxHQUFHLEVBQ3hDLFNBQVMsQ0FBQyxVQUFVLEVBQ3BCLFNBQVMsQ0FBQyxLQUFLLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTSxJQUFJLEdBQUcsR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQ2xFLENBQUE7QUFDSCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxhQUFhLENBQXFELEVBQ2hGLE9BQU8sRUFDUCxLQUFLLEVBQ0wsT0FBTyxFQUNQLElBQUksRUFDeUI7SUFDN0IsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUN2QixPQUFPLEVBQ1AsS0FBSyxJQUFJLElBQUksS0FBSyxHQUFHLEVBQ3JCLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxDQUNwQixDQUFBO0lBRUQsT0FBTyxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUMvRCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxlQUFlLENBQzdCLEVBQUUsUUFBUSxFQUFnQztJQUUxQyxPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMxQixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxhQUFhLENBQzNCLEVBQUUsVUFBVSxFQUFnQztJQUU1QyxPQUFPLElBQUksQ0FDVCxVQUFVLEVBQ1YsS0FBSyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQ2YsT0FBTyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ3ZCLElBQUksQ0FDRixLQUFLLENBQUMsS0FBSyxFQUNYLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDbEIsQ0FDRixFQUNELE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FDWCxDQUFBO0FBQ0gsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGFBQWEsQ0FDM0IsT0FBcUMsRUFDckMsTUFBaUM7SUFFakMsTUFBTSxFQUNKLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUFFLGFBQWEsRUFDdEIsR0FBRyxPQUFPLENBQUE7SUFDWCxNQUFNLEVBQ0osSUFBSSxFQUNKLFVBQVUsRUFDVixNQUFNLEVBQ1AsR0FBRyxNQUFNLENBQUE7SUFDVixNQUFNLFVBQVUsR0FBRyxJQUFJO1FBQ3JCLENBQUMsQ0FBQyxjQUFjO1lBQ2QsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHO1lBQ3JFLENBQUMsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUNOLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUM3QixVQUFVLEVBQ1YsQ0FBQyxhQUFhLEVBQUUsRUFBRTtRQUNoQixJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ25CLE9BQU8sSUFBSSxDQUNULFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFDeEIsR0FBRyxDQUFDLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsRUFBRSxLQUFLLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUNoRixDQUFBO1FBQ0gsQ0FBQztRQUVELE9BQU8sU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBQ2pDLENBQUMsRUFDRCxHQUFHLENBQ0osQ0FBQTtJQUVELE9BQU8sT0FBTyxDQUNaLEtBQUssQ0FDSCxNQUFNLEVBQ04sVUFBVSxDQUNYLEVBQ0Qsa0JBQWtCLElBQUksWUFBWSxrQkFBa0IsRUFBRSxDQUN2RCxDQUFBO0FBQ0gsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUN0QixPQUFxQztJQUVyQyxNQUFNLEVBQ0osYUFBYSxFQUNiLGVBQWUsRUFDZixhQUFhLEVBQ2IsYUFBYSxFQUNiLFlBQVksRUFDYixHQUFHLE9BQU8sQ0FBQTtJQUVYLE9BQU8sUUFBUSxDQUNiLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFDdEIsZUFBZSxDQUFDLE9BQU8sQ0FBQyxFQUN4QixJQUFJLENBQ0YsWUFBWSxFQUNaLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUNYLEtBQUssQ0FBQyxPQUFPLEVBQ2IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUN6QyxDQUNGLEVBQ0QsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUN2QixDQUFBO0FBQ0gsQ0FBQyJ9