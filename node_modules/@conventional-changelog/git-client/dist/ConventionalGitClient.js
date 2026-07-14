import semver from 'semver';
import { firstFromStream } from '@simple-libs/stream-utils';
import { GitClient } from './GitClient.js';
/**
 * Helper to get package tag prefix.
 * @param packageName
 * @returns Tag prefix.
 */
export function packagePrefix(packageName) {
    if (!packageName) {
        return /^.+@/;
    }
    return `${packageName}@`;
}
/**
 * Wrapper around Git CLI with conventional commits support.
 */
export class ConventionalGitClient extends GitClient {
    deps = null;
    loadDeps() {
        if (this.deps) {
            return this.deps;
        }
        this.deps = Promise.all([
            import('conventional-commits-parser')
                .then(({ parseCommits }) => parseCommits),
            import('conventional-commits-filter')
                .then(({ filterRevertedCommits }) => filterRevertedCommits)
        ]);
        return this.deps;
    }
    /**
     * Get parsed commits stream.
     * @param params
     * @param params.path - Read commits from specific path.
     * @param params.from - Start commits range.
     * @param params.to - End commits range.
     * @param params.format - Commits format.
     * @param parserOptions - Commit parser options.
     * @yields Raw commits data.
     */
    async *getCommits(params = {}, parserOptions = {}) {
        const { filterReverts, ...gitLogParams } = params;
        const [parseCommits, filterRevertedCommits] = await this.loadDeps();
        if (filterReverts) {
            yield* filterRevertedCommits(this.getCommits(gitLogParams, parserOptions));
            return;
        }
        const parse = parseCommits(parserOptions);
        const commitsStream = this.getRawCommits(gitLogParams);
        yield* parse(commitsStream);
    }
    /**
     * Get semver tags stream.
     * @param params
     * @param params.prefix - Get semver tags with specific prefix.
     * @param params.skipUnstable - Skip semver tags with unstable versions.
     * @param params.clean - Clean version from prefix and trash.
     * @param params.path - Read tags from specific path.
     * @param params.from - Start tags range.
     * @param params.to - End tags range.
     * @param params.since - Get tags since specific date.
     * @yields Semver tags.
     */
    async *getSemverTags(params = {}) {
        const { prefix, skipUnstable, clean, ...getTagsParams } = params;
        const tagsStream = this.getTags(getTagsParams);
        const unstableTagRegex = /\d+\.\d+\.\d+-.+/;
        const cleanTag = clean
            ? (tag, unprefixed) => semver.clean(unprefixed || tag)
            : (tag) => tag;
        let unprefixed;
        let tag;
        for await (tag of tagsStream) {
            if (skipUnstable && unstableTagRegex.test(tag)) {
                continue;
            }
            if (prefix) {
                const isPrefixed = typeof prefix === 'string'
                    ? tag.startsWith(prefix)
                    : prefix.test(tag);
                if (isPrefixed) {
                    unprefixed = tag.replace(prefix, '');
                    if (semver.valid(unprefixed)) {
                        tag = cleanTag(tag, unprefixed);
                        if (tag) {
                            yield tag;
                        }
                    }
                }
            }
            else if (semver.valid(tag)) {
                tag = cleanTag(tag);
                if (tag) {
                    yield tag;
                }
            }
        }
    }
    /**
     * Get last semver tag.
     * @param params - getSemverTags params.
     * @returns Last semver tag, `null` if not found.
     */
    async getLastSemverTag(params = {}) {
        return firstFromStream(this.getSemverTags(params));
    }
    /**
     * Get current sematic version from git tags.
     * @param params - Additional git params.
     * @returns Current sematic version, `null` if not found.
     */
    async getVersionFromTags(params = {}) {
        const semverTagsStream = this.getSemverTags({
            clean: true,
            ...params
        });
        const semverTags = [];
        for await (const tag of semverTagsStream) {
            semverTags.push(tag);
        }
        if (!semverTags.length) {
            return null;
        }
        return semverTags.sort(semver.rcompare)[0] || null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVudGlvbmFsR2l0Q2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NvbnZlbnRpb25hbEdpdENsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQSxPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUE7QUFDM0IsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFBO0FBSzNELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUUxQzs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLGFBQWEsQ0FBQyxXQUFvQjtJQUNoRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDakIsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDO0lBRUQsT0FBTyxHQUFHLFdBQVcsR0FBRyxDQUFBO0FBQzFCLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxTQUFTO0lBQzFDLElBQUksR0FBd0UsSUFBSSxDQUFBO0lBRWhGLFFBQVE7UUFDZCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQTtRQUNsQixDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQztpQkFDbEMsSUFBSSxDQUFDLENBQUMsRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDO1lBQzNDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQztpQkFDbEMsSUFBSSxDQUFDLENBQUMsRUFBRSxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztTQUM5RCxDQUFDLENBQUE7UUFFRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUE7SUFDbEIsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILEtBQUssQ0FBQSxDQUFFLFVBQVUsQ0FDZixNQUFNLEdBQXFCLEVB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