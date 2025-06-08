import { ConventionalGitClient, packagePrefix } from '@conventional-changelog/git-client';
import { createPresetLoader, loadPreset as defaultLoadPreset } from 'conventional-changelog-preset-loader';
import { isIterable, bindLogNamespace } from './utils.js';
export { packagePrefix };
const VERSIONS = [
    'major',
    'minor',
    'patch'
];
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
            throw Error('`whatBump` must be a function');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVtcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2J1bXBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxPQUFPLEVBR0wscUJBQXFCLEVBQ3JCLGFBQWEsRUFDZCxNQUFNLG9DQUFvQyxDQUFBO0FBQzNDLE9BQU8sRUFJTCxrQkFBa0IsRUFDbEIsVUFBVSxJQUFJLGlCQUFpQixFQUNoQyxNQUFNLHNDQUFzQyxDQUFBO0FBTzdDLE9BQU8sRUFDTCxVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2pCLE1BQU0sWUFBWSxDQUFBO0FBRW5CLE9BQU8sRUFBRSxhQUFhLEVBQUUsQ0FBQTtBQUV4QixNQUFNLFFBQVEsR0FBRztJQUNmLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztDQUNDLENBQUE7QUFFVjs7R0FFRztBQUNILE1BQU0sT0FBTyxNQUFNO0lBQ0EsU0FBUyxDQUF1QjtJQUN6QyxNQUFNLENBQWlCO0lBQ3ZCLFFBQVEsQ0FBMkI7SUFDbkMsU0FBUyxDQUF1QztJQUNoRCxhQUFhLENBQWdEO0lBRXJFLFlBQVksaUJBQWlELE9BQU8sQ0FBQyxHQUFHLEVBQUU7UUFDeEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLGNBQWMsS0FBSyxRQUFRO1lBQ2pELENBQUMsQ0FBQyxJQUFJLHFCQUFxQixDQUFDLGNBQWMsQ0FBQztZQUMzQyxDQUFDLENBQUMsY0FBYyxDQUFBO1FBRWxCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUM1QixPQUFPLEVBQUU7Z0JBQ1AsTUFBTSxFQUFFLGdCQUFnQjtnQkFDeEIsYUFBYSxFQUFFLElBQUk7YUFDcEI7U0FDRixDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1FBQzlDLElBQUksQ0FBQyxhQUFhLEdBQUcsR0FB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