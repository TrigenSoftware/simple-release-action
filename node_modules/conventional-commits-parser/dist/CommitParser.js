import { getParserRegexes } from './regex.js';
import { trimNewLines, appendLine, getCommentFilter, gpgFilter, truncateToScissor, assignMatchedCorrespondence } from './utils.js';
import { defaultOptions } from './options.js';
/**
 * Helper to create commit object.
 * @param initialData - Initial commit data.
 * @returns Commit object with empty data.
 */
export function createCommitObject(initialData = {}) {
    // @ts-expect-error: You can read properties from `Commit` without problems, but you can't assign object to this type. So here is helper for that.
    return {
        merge: null,
        revert: null,
        header: null,
        body: null,
        footer: null,
        notes: [],
        mentions: [],
        references: [],
        ...initialData
    };
}
/**
 * Commit message parser.
 */
export class CommitParser {
    options;
    regexes;
    lines = [];
    lineIndex = 0;
    commit = createCommitObject();
    constructor(options = {}) {
        this.options = {
            ...defaultOptions,
            ...options
        };
        this.regexes = getParserRegexes(this.options);
    }
    currentLine() {
        return this.lines[this.lineIndex];
    }
    nextLine() {
        return this.lines[this.lineIndex++];
    }
    isLineAvailable() {
        return this.lineIndex < this.lines.length;
    }
    parseReference(input, action) {
        const { regexes } = this;
        if (regexes.url.test(input)) {
            return null;
        }
        const matches = regexes.referenceParts.exec(input);
        if (!matches) {
            return null;
        }
        let [raw, repository = null, prefix, issue] = matches;
        let owner = null;
        if (repository) {
            const slashIndex = repository.indexOf('/');
            if (slashIndex !== -1) {
                owner = repository.slice(0, slashIndex);
                repository = repository.slice(slashIndex + 1);
            }
        }
        return {
            raw,
            action,
            owner,
            repository,
            prefix,
            issue
        };
    }
    parseReferences(input) {
        const { regexes } = this;
        const regex = input.match(regexes.references)
            ? regexes.references
            : /()(.+)/gi;
        const references = [];
        let matches;
        let action;
        let sentence;
        let reference;
        while (true) {
            matches = regex.exec(input);
            if (!matches) {
                break;
            }
            action = matches[1] || null;
            sentence = matches[2] || '';
            while (true) {
                reference = this.parseReference(sentence, action);
                if (!reference) {
                    break;
                }
                references.push(reference);
            }
        }
        return references;
    }
    skipEmptyLines() {
        let line = this.currentLine();
        while (line !== undefined && !line.trim()) {
            this.nextLine();
            line = this.currentLine();
        }
    }
    parseMerge() {
        const { commit, options } = this;
        const correspondence = options.mergeCorrespondence || [];
        const merge = this.currentLine();
        const matches = merge && options.mergePattern
            ? merge.match(options.mergePattern)
            : null;
        if (matches) {
            this.nextLine();
            commit.merge = matches[0] || null;
            assignMatchedCorrespondence(commit, matches, correspondence);
            return true;
        }
        return false;
    }
    parseHeader(isMergeCommit) {
        if (isMergeCommit) {
            this.skipEmptyLines();
        }
        const { commit, options } = this;
        const correspondence = options.headerCorrespondence || [];
        const header = commit.header ?? this.nextLine();
        let matches = null;
        if (header) {
            if (options.breakingHeaderPattern) {
                matches = header.match(options.breakingHeaderPattern);
            }
            if (!matches && options.headerPattern) {
                matches = header.match(options.headerPattern);
            }
        }
        if (header) {
            commit.header = header;
        }
        if (matches) {
            assignMatchedCorrespondence(commit, matches, correspondence);
        }
    }
    parseMeta() {
        const { options, commit } = this;
        if (!options.fieldPattern || !this.isLineAvailable()) {
            return false;
        }
        let matches;
        let field = null;
        let parsed = false;
        while (this.isLineAvailable()) {
            matches = this.currentLine().match(options.fieldPattern);
            if (matches) {
                field = matches[1] || null;
                this.nextLine();
                continue;
            }
            if (field) {
                parsed = true;
                commit[field] = appendLine(commit[field], this.currentLine());
                this.nextLine();
            }
            else {
                break;
            }
        }
        return parsed;
    }
    parseNotes() {
        const { regexes, commit } = this;
        if (!this.isLineAvailable()) {
            return false;
        }
        const matches = this.currentLine().match(regexes.notes);
        let isFooterToken;
        if (matches) {
            const note = {
                title: matches[1],
                text: matches[2]
            };
            commit.notes.push(note);
            commit.footer = appendLine(commit.footer, this.currentLine());
            this.nextLine();
            while (this.isLineAvailable()) {
                if (this.parseMeta()) {
                    return true;
                }
                if (this.parseNotes()) {
                    return true;
                }
                isFooterToken = regexes.footerToken.test(this.currentLine());
                commit.references.push(...this.parseReferences(this.currentLine()));
                if (!isFooterToken) {
                    note.text = appendLine(note.text, this.currentLine());
                }
                commit.footer = appendLine(commit.footer, this.currentLine());
                this.nextLine();
                if (isFooterToken) {
                    break;
                }
            }
            return true;
        }
        return false;
    }
    parseBodyAndFooter(isBody) {
        const { commit, regexes } = this;
        if (!this.isLineAvailable()) {
            return isBody;
        }
        const isFooterToken = regexes.footerToken.test(this.currentLine());
        const isStillBody = !isFooterToken && isBody;
        commit.references.push(...this.parseReferences(this.currentLine()));
        if (isStillBody) {
            commit.body = appendLine(commit.body, this.currentLine());
        }
        else {
            commit.footer = appendLine(commit.footer, this.currentLine());
        }
        this.nextLine();
        return isStillBody;
    }
    parseBreakingHeader() {
        const { commit, options } = this;
        if (!options.breakingHeaderPattern || commit.notes.length || !commit.header) {
            return;
        }
        const matches = commit.header.match(options.breakingHeaderPattern);
        if (matches) {
            commit.notes.push({
                title: 'BREAKING CHANGE',
                text: matches[3]
            });
        }
    }
    parseMentions(input) {
        const { commit, regexes } = this;
        let matches;
        for (;;) {
            matches = regexes.mentions.exec(input);
            if (!matches) {
                break;
            }
            commit.mentions.push(matches[1]);
        }
    }
    parseRevert(input) {
        const { commit, options } = this;
        const correspondence = options.revertCorrespondence || [];
        const matches = options.revertPattern
            ? input.match(options.revertPattern)
            : null;
        if (matches) {
            commit.revert = assignMatchedCorrespondence({}, matches, correspondence);
        }
    }
    cleanupCommit() {
        const { commit } = this;
        commit.body &&= trimNewLines(commit.body);
        commit.footer &&= trimNewLines(commit.footer);
        commit.notes.forEach((note) => {
            note.text = trimNewLines(note.text);
        });
        const referencesSet = new Set();
        commit.references = commit.references.filter((reference) => {
            const uid = `${reference.action} ${reference.raw}`.toLocaleLowerCase();
            const ok = !referencesSet.has(uid);
            if (ok) {
                referencesSet.add(uid);
            }
            return ok;
        });
    }
    /**
     * Parse commit message string into an object.
     * @param input - Commit message string.
     * @returns Commit object.
     */
    parse(input) {
        if (!input.trim()) {
            throw new TypeError('Expected a raw commit');
        }
        const { commentChar } = this.options;
        const commentFilter = getCommentFilter(commentChar);
        const rawLines = trimNewLines(input).split(/\r?\n/);
        const lines = commentChar
            ? truncateToScissor(rawLines, commentChar).filter(line => commentFilter(line) && gpgFilter(line))
            : rawLines.filter(line => gpgFilter(line));
        const commit = createCommitObject();
        this.lines = lines;
        this.lineIndex = 0;
        this.commit = commit;
        const isMergeCommit = this.parseMerge();
        this.parseHeader(isMergeCommit);
        if (commit.header) {
            commit.references = this.parseReferences(commit.header);
        }
        let isBody = true;
        while (this.isLineAvailable()) {
            this.parseMeta();
            if (this.parseNotes()) {
                isBody = false;
            }
            if (!this.parseBodyAndFooter(isBody)) {
                isBody = false;
            }
        }
        this.parseBreakingHeader();
        this.parseMentions(input);
        this.parseRevert(input);
        this.cleanupCommit();
        return commit;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWl0UGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NvbW1pdFBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxZQUFZLENBQUE7QUFDN0MsT0FBTyxFQUNMLFlBQVksRUFDWixVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsMkJBQTJCLEVBQzVCLE1BQU0sWUFBWSxDQUFBO0FBQ25CLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxjQUFjLENBQUE7QUFFN0M7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxXQUFXLEdBQW9CLEVBQUU7SUFDbEUsa0pBQWtKO0lBQ2xKLE9BQU87UUFDTCxLQUFLLEVBQUUsSUFBSTtRQUNYLE1BQU0sRUFBRSxJQUFJO1FBQ1osTUFBTSxFQUFFLElBQUk7UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLE1BQU0sRUFBRSxJQUFJO1FBQ1osS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsRUFBRTtRQUNaLFVBQVUsRUFBRSxFQUFFO1FBQ2QsR0FBRyxXQUFXO0tBQ2YsQ0FBQTtBQUNILENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sT0FBTyxZQUFZO0lBQ04sT0FBTyxDQUFlO0lBQ3RCLE9BQU8sQ0FBZTtJQUMvQixLQUFLLEdBQWEsRUFBRSxDQUFBO0lBQ3BCLFNBQVMsR0FBRyxDQUFDLENBQUE7SUFDYixNQUFNLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQTtJQUVyQyxZQUFZLE9BQU8sR0FBa0IsRUFBRTtRQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsR0FBRyxjQUFjO1lBQ2pCLEdBQUcsT0FBTztTQUNYLENBQUE7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUMvQyxDQUFDO0lBRU8sV0FBVztRQUNq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