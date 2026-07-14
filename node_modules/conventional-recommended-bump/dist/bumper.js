import { ConventionalGitClient, packagePrefix } from '@conventional-changelog/git-client';
import { createPresetLoader, loadPreset as defaultLoadPreset } from 'conventional-changelog-preset-loader';
import { isIterable, bindLogNamespace } from './utils.js';
export { packagePrefix };
const VERSIONS = [
    'major',
    'minor',
    'patch'
];
export const WHAT_BUMP_ERROR_MESSAGE = '`whatBump` must be a function';
/**
 * Bump suggester for conventional commits
 */
export class Bumper {
    gitClient;
    params;
    whatBump;
    tagGetter;
    commitsGetter;
    constructor(cwdOrGitClient = process.cwd()) {
        this.gitClient = typeof cwdOrGitClient === 'string'
            ? new ConventionalGitClient(cwdOrGitClient)
            : cwdOrGitClient;
        this.whatBump = null;
        this.params = Promise.resolve({
            commits: {
                format: '%B%n-hash-%n%H',
                filterReverts: true
            }
        });
        this.tagGetter = () => this.getLastSemverTag();
        this.commitsGetter = () => this.getCommits();
    }
    composeParams(params) {
        this.params = Promise.all([params, this.params]).then(([params, prevParams]) => ({
            options: {
                ...prevParams.options,
                ...params.options
            },
            tags: {
                ...prevParams.tags,
                ...params.tags
            },
            commits: {
                ...prevParams.commits,
                ...params.commits
            },
            parser: {
                ...prevParams.parser,
                ...params.parser
            }
        }));
    }
    async getLastSemverTag() {
        const { tags } = await this.params;
        return await this.gitClient.getLastSemverTag(tags);
    }
    async *getCommits() {
        const { options, commits, parser } = await this.params;
        const parserParams = {
            ...parser
        };
        if (!parserParams.warn && options?.warn) {
            parserParams.warn = bindLogNamespace('parser', options.warn);
        }
        yield* this.gitClient.getCommits({
            from: await this.tagGetter() || '',
            ...commits
        }, parserParams);
    }
    /**
     * Load configs from a preset
     * @param preset
     * @param loader - Preset module loader, if not provided, will use default loader
     * @returns this
     */
    loadPreset(preset, loader) {
        const loadPreset = loader ? createPresetLoader(loader) : defaultLoadPreset;
        const config = loadPreset(preset).then((config) => {
            if (!config) {
                throw Error('Preset is not loaded or have incorrect exports');
            }
            return config;
        });
        this.whatBump = async (commits) => {
            const { whatBump } = await config;
            return whatBump(commits);
        };
        this.composeParams(config);
        return this;
    }
    /**
     * Set config directly
     * @param config - Config object
     * @returns this
     */
    config(config) {
        this.composeParams(config);
        return this;
    }
    /**
     * Set bumper options
     * @param options - Bumper options
     * @returns this
     */
    options(options) {
        this.composeParams({
            options
        });
        return this;
    }
    /**
     * Set params to get the last semver tag
     * @param paramsOrTag - Params to get the last semver tag or a tag name
     * @returns this
     */
    tag(paramsOrTag) {
        if (typeof paramsOrTag === 'string') {
            this.tagGetter = () => paramsOrTag;
        }
        else {
            this.tagGetter = () => this.getLastSemverTag();
            this.composeParams({
                tags: paramsOrTag
            });
        }
        return this;
    }
    commits(paramsOrCommits, parserOptions) {
        if (isIterable(paramsOrCommits)) {
            this.commitsGetter = () => paramsOrCommits;
        }
        else {
            this.commitsGetter = () => this.getCommits();
            this.composeParams({
                commits: paramsOrCommits,
                parser: parserOptions
            });
        }
        return this;
    }
    /**
     * Recommend a bump by `whatBump` function
     * @param whatBump - Function to recommend a bump from commits
     * @returns Bump recommendation
     */
    async bump(whatBump = this.whatBump) {
        if (typeof whatBump !== 'function') {
            throw Error(WHAT_BUMP_ERROR_MESSAGE);
        }
        const { gitClient } = this;
        const { options } = await this.params;
        if (!gitClient.debug && options?.debug) {
            gitClient.debug = bindLogNamespace('git-client', options.debug);
        }
        const commitsStream = this.commitsGetter();
        const commits = [];
        let commit;
        for await (commit of commitsStream) {
            commits.push(commit);
        }
        const result = await whatBump(commits);
        if (result && 'level' in result) {
            return {
                ...result,
                releaseType: VERSIONS[result.level],
                commits
            };
        }
        return {
            commits
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVtcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2J1bXBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxPQUFPLEVBR0wscUJBQXFCLEVBQ3JCLGFBQWEsRUFDZCxNQUFNLG9DQUFvQyxDQUFBO0FBQzNDLE9BQU8sRUFJTCxrQkFBa0IsRUFDbEIsVUFBVSxJQUFJLGlCQUFpQixFQUNoQyxNQUFNLHNDQUFzQyxDQUFBO0FBTzdDLE9BQU8sRUFDTCxVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2pCLE1BQU0sWUFBWSxDQUFBO0FBRW5CLE9BQU8sRUFBRSxhQUFhLEVBQUUsQ0FBQTtBQUV4QixNQUFNLFFBQVEsR0FBRztJQUNmLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztDQUNDLENBQUE7QUFFVixNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBRywrQkFBK0IsQ0FBQTtBQUV0RTs7R0FFRztBQUNILE1BQU0sT0FBTyxNQUFNO0lBQ0EsU0FBUyxDQUF1QjtJQUN6QyxNQUFNLENBQWlCO0lBQ3ZCLFFBQVEsQ0FBMkI7SUFDbkMsU0FBUyxDQUF1QztJQUNoRCxhQUFhLENBQWdEO0lBRXJFLFlBQVksY0FBYyxHQUFtQyxPQUFPLENBQUMsR0FBRyxFQUFFO1FBQ3hFLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxjQUFjLEtBQUssUUFBUTtZQUNqRCxDQUFDLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxjQUFjLENBQUM7WUFDM0MsQ0FBQyxDQUFDLGNBQWMsQ0FBQTtRQUVsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDNUIsT0FBTyxFQUFFO2dCQUNQLE1BQU0sRUFBRSxnQkFBZ0I7Z0JBQ3hCLGFBQWEsRUFBRSxJQUFJO2FBQ3BCO1NBQ0YsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENB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