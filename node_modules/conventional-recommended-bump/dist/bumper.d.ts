import type { ParserStreamOptions, Commit } from 'conventional-commits-parser';
import { type GetSemverTagsParams, type GetCommitsParams, ConventionalGitClient, packagePrefix } from '@conventional-changelog/git-client';
import { type UnknownPresetCreatorParams, type PresetParams, type PresetModuleLoader } from 'conventional-changelog-preset-loader';
import type { Options, Preset, BumperRecommendationResult } from './types.js';
export { packagePrefix };
/**
 * Bump suggester for conventional commits
 */
export declare class Bumper {
    private readonly gitClient;
    private params;
    private whatBump;
    private tagGetter;
    private commitsGetter;
    constructor(cwdOrGitClient?: string | ConventionalGitClient);
    private composeParams;
    private getLastSemverTag;
    private getCommits;
    /**
     * Load configs from a preset
     * @param preset
     * @param loader - Preset module loader, if not provided, will use default loader
     * @returns this
     */
    loadPreset<PresetCreatorParams extends UnknownPresetCreatorParams = UnknownPresetCreatorParams>(preset: PresetParams<PresetCreatorParams>, loader?: PresetModuleLoader): this;
    /**
     * Set config directly
     * @param config - Config object
     * @returns this
     */
    config(config: Preset | Promise<Preset>): this;
    /**
     * Set bumper options
     * @param options - Bumper options
     * @returns this
     */
    options(options: Options): this;
    /**
     * Set params to get the last semver tag
     * @param paramsOrTag - Params to get the last semver tag or a tag name
     * @returns this
     */
    tag(paramsOrTag: GetSemverTagsParams | string): this;
    /**
     * Set params to get commits since last release
     * @param params - Params to get commits since last release
     * @param parserOptions - Parser options
     * @returns this
     */
    commits(params: GetCommitsParams, parserOptions?: ParserStreamOptions): this;
    /**
     * Set commits since last release
     * @param commits - Iterable or async iterable of commits
     * @returns this
     */
    commits(commits: Iterable<Commit> | AsyncIterable<Commit>): this;
    /**
     * Recommend a bump by `whatBump` function
     * @param whatBump - Function to recommend a bump from commits
     * @returns Bump recommendation
     */
    bump(whatBump?: ((commits: Commit[]) => import("./types.js").WhatBumpResult | Promise<import("./types.js").WhatBumpResult>) | null): Promise<BumperRecommendationResult>;
}
//# sourceMappingURL=bumper.d.ts.map