const nomatchRegex = /(?!.*)/;
function escape(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function joinOr(parts) {
    return parts
        .map(val => (typeof val === 'string' ? escape(val.trim()) : val.source))
        .filter(Boolean)
        .join('|');
}
function getNotesRegex(noteKeywords, notesPattern) {
    if (!noteKeywords) {
        return nomatchRegex;
    }
    const noteKeywordsSelection = joinOr(noteKeywords);
    if (!notesPattern) {
        return new RegExp(`^[\\s|*]*(${noteKeywordsSelection})[:\\s]+(.*)`, 'i');
    }
    return notesPattern(noteKeywordsSelection);
}
function getReferencePartsRegex(issuePrefixes, issuePrefixesCaseSensitive) {
    if (!issuePrefixes) {
        return nomatchRegex;
    }
    const flags = issuePrefixesCaseSensitive ? 'g' : 'gi';
    return new RegExp(`(?:.*?)??\\s*([\\w-\\.\\/]*?)??(${joinOr(issuePrefixes)})([\\w-]+)(?=\\s|$|[,;.)\\]])`, flags);
}
function getReferencesRegex(referenceActions) {
    if (!referenceActions) {
        // matches everything
        return /()(.+)/gi;
    }
    const joinedKeywords = joinOr(referenceActions);
    return new RegExp(`(${joinedKeywords})(?:\\s+(.*?))(?=(?:${joinedKeywords})|$)`, 'gi');
}
function getFooterTokenRegex(issuePrefixes) {
    const issuePrefixSeparator = issuePrefixes
        ? `|\\s+(?:${joinOr(issuePrefixes)})`
        : '';
    return new RegExp(`^\\s*(?:BREAKING CHANGE|[\\w-]+)(?::\\s+${issuePrefixSeparator}).+`, 'i');
}
/**
 * Make the regexes used to parse a commit.
 * @param options
 * @returns Regexes.
 */
export function getParserRegexes(options = {}) {
    const notes = getNotesRegex(options.noteKeywords, options.notesPattern);
    const referenceParts = getReferencePartsRegex(options.issuePrefixes, options.issuePrefixesCaseSensitive);
    const references = getReferencesRegex(options.referenceActions);
    const footerToken = getFooterTokenRegex(options.issuePrefixes);
    return {
        notes,
        referenceParts,
        references,
        footerToken,
        mentions: /@([\w-]+)/g,
        url: /\b(?:https?):\/\/(?:www\.)?([-a-zA-Z0-9@:%_+.~#?&//=])+\b/
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVnZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0EsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFBO0FBRTdCLFNBQVMsTUFBTSxDQUFDLE1BQWM7SUFDNUIsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ3RELENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxLQUEwQjtJQUN4QyxPQUFPLEtBQUs7U0FDVCxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkUsTUFBTSxDQUFDLE9BQU8sQ0FBQztTQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNkLENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FDcEIsWUFBNkMsRUFDN0MsWUFBb0Q7SUFFcEQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2xCLE9BQU8sWUFBWSxDQUFBO0lBQ3JCLENBQUM7SUFFRCxNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUVsRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbEIsT0FBTyxJQUFJLE1BQU0sQ0FBQyxhQUFhLHFCQUFxQixjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDMUUsQ0FBQztJQUVELE9BQU8sWUFBWSxDQUFDLHFCQUFxQixDQUFDLENBQUE7QUFDNUMsQ0FBQztBQUVELFNBQVMsc0JBQXNCLENBQzdCLGFBQThDLEVBQzlDLDBCQUErQztJQUUvQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDbkIsT0FBTyxZQUFZLENBQUE7SUFDckIsQ0FBQztJQUVELE1BQU0sS0FBSyxHQUFHLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtJQUVyRCxPQUFPLElBQUksTUFBTSxDQUFDLG1DQUFtQyxNQUFNLENBQUMsYUFBYSxDQUFDLCtCQUErQixFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ25ILENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUN6QixnQkFBaUQ7SUFFakQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDdEIscUJBQXFCO1FBQ3JCLE9BQU8sVUFBVSxDQUFBO0lBQ25CLENBQUM7SUFFRCxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtJQUUvQyxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksY0FBYyx1QkFBdUIsY0FBYyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDeEYsQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQzFCLGFBQThDO0lBRTlDLE1BQU0sb0JBQW9CLEdBQUcsYUFBYTtRQUN4QyxDQUFDLENBQUMsV0FBVyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUc7UUFDckMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUVOLE9BQU8sSUFBSSxNQUFNLENBQUMsMkNBQTJDLG9CQUFvQixLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDOUYsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQzlCLE9BQU8sR0FBK0gsRUFBRTtJQUV4SSxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7SUFDdkUsTUFBTSxjQUFjLEdBQUcsc0JBQXNCLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtJQUN4RyxNQUFNLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtJQUMvRCxNQUFNLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7SUFFOUQsT0FBTztRQUNMLEtBQUs7UUFDTCxjQUFjO1FBQ2QsVUFBVTtRQUNWLFdBQVc7UUFDWCxRQUFRLEVBQUUsWUFBWTtRQUN0QixHQUFHLEVBQUUsMkRBQTJEO0tBQ2pFLENBQUE7QUFDSCxDQUFDIn0=