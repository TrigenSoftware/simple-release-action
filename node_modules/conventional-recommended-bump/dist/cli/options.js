import { packagePrefix } from '@conventional-changelog/git-client';
function trim(str) {
    return str.trim();
}
export function parseTagsOptions(options) {
    const result = {};
    if (typeof options.tagPrefix === 'string') {
        result.prefix = options.tagPrefix;
    }
    if (typeof options.lernaPackage === 'string') {
        result.prefix = packagePrefix(options.lernaPackage);
    }
    if (options.skipUnstable) {
        result.skipUnstable = true;
    }
    if (!Object.keys(result).length) {
        return null;
    }
    return result;
}
export function parseCommitsOptions(options) {
    const result = {};
    if (typeof options.commitPath === 'string') {
        result.path = options.commitPath;
    }
    if (!Object.keys(result).length) {
        return null;
    }
    return result;
}
export function parseParserOptions(options) {
    const result = {};
    if (typeof options.headerPattern === 'string') {
        result.headerPattern = new RegExp(options.headerPattern);
    }
    if (typeof options.headerCorrespondence === 'string') {
        result.headerCorrespondence = options.headerCorrespondence.split(',').map(trim);
    }
    if (typeof options.referenceActions === 'string') {
        result.referenceActions = options.referenceActions.split(',').map(trim);
    }
    if (typeof options.issuePrefixes === 'string') {
        result.issuePrefixes = options.issuePrefixes.split(',').map(trim);
    }
    if (typeof options.noteKeywords === 'string') {
        result.noteKeywords = options.noteKeywords.split(',').map(trim);
    }
    if (typeof options.fieldPattern === 'string') {
        result.fieldPattern = new RegExp(options.fieldPattern);
    }
    if (typeof options.revertPattern === 'string') {
        result.revertPattern = new RegExp(options.revertPattern);
    }
    if (typeof options.revertCorrespondence === 'string') {
        result.revertCorrespondence = options.revertCorrespondence.split(',').map(trim);
    }
    if (typeof options.mergePattern === 'string') {
        result.mergePattern = new RegExp(options.mergePattern);
    }
    if (options.verbose) {
        result.warn = console.warn.bind(console);
    }
    else {
        result.warn = true;
    }
    if (!Object.keys(result).length) {
        return null;
    }
    return options;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvb3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0NBQW9DLENBQUE7QUFFbEUsU0FBUyxJQUFJLENBQUMsR0FBVztJQUN2QixPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNuQixDQUFDO0FBRUQsTUFBTSxVQUFVLGdCQUFnQixDQUFDLE9BQWdDO0lBQy9ELE1BQU0sTUFBTSxHQUF3QixFQUFFLENBQUE7SUFFdEMsSUFBSSxPQUFPLE9BQU8sQ0FBQyxTQUFTLEtBQUssUUFBUSxFQUFFO1FBQ3pDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQTtLQUNsQztJQUVELElBQUksT0FBTyxPQUFPLENBQUMsWUFBWSxLQUFLLFFBQVEsRUFBRTtRQUM1QyxNQUFNLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7S0FDcEQ7SUFFRCxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7UUFDeEIsTUFBTSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUE7S0FDM0I7SUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUU7UUFDL0IsT0FBTyxJQUFJLENBQUE7S0FDWjtJQUVELE9BQU8sTUFBTSxDQUFBO0FBQ2YsQ0FBQztBQUVELE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxPQUFnQztJQUNsRSxNQUFNLE1BQU0sR0FBcUIsRUFBRSxDQUFBO0lBRW5DLElBQUksT0FBTyxPQUFPLENBQUMsVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUMxQyxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUE7S0FDakM7SUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FB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