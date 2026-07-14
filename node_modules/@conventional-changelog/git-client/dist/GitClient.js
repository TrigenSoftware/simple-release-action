import { spawn } from 'child_process';
import { firstFromStream, splitStream } from '@simple-libs/stream-utils';
import { output, outputStream } from '@simple-libs/child-process-utils';
import { formatArgs, toArray } from './utils.js';
const SCISSOR = '------------------------ >8 ------------------------';
/**
 * Wrapper around Git CLI.
 */
export class GitClient {
    cwd;
    debug;
    constructor(cwd, debug) {
        this.cwd = cwd;
        this.debug = debug;
    }
    formatArgs(...args) {
        const finalArgs = formatArgs(...args);
        if (this.debug) {
            this.debug(finalArgs);
        }
        return finalArgs;
    }
    /**
     * Raw exec method to run git commands.
     * @param args
     * @returns Stdout string output of the command.
     */
    async exec(...args) {
        return (await output(spawn('git', this.formatArgs(...args), {
            cwd: this.cwd
        }))).toString().trim();
    }
    /**
     * Raw exec method to run git commands with stream output.
     * @param args
     * @returns Stdout stream of the command.
     */
    execStream(...args) {
        return outputStream(spawn('git', this.formatArgs(...args), {
            cwd: this.cwd
        }));
    }
    /**
     * Initialize a new git repository.
     * @returns Boolean result.
     */
    async init() {
        try {
            await this.exec('init');
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Get raw commits stream.
     * @param params
     * @param params.path - Read commits from specific path.
     * @param params.from - Start commits range.
     * @param params.to - End commits range.
     * @param params.format - Commits format.
     * @yields Raw commits data.
     */
    async *getRawCommits(params = {}) {
        const { path, from = '', to = 'HEAD', format = '%B', ignore, reverse, merges, since, firstParent } = params;
        const shouldNotIgnore = ignore
            ? (chunk) => !ignore.test(chunk)
            : () => true;
        const stdout = this.execStream('log', `--format=${format}%n${SCISSOR}`, since && `--since=${since instanceof Date ? since.toISOString() : since}`, reverse && '--reverse', merges && '--merges', merges === false && '--no-merges', firstParent && '--first-parent', [from, to].filter(Boolean).join('..'), ...path ? ['--', ...toArray(path)] : []);
        const commitsStream = splitStream(stdout, `${SCISSOR}\n`);
        let chunk;
        for await (chunk of commitsStream) {
            if (shouldNotIgnore(chunk)) {
                yield chunk;
            }
        }
    }
    /**
     * Get tags stream.
     * @param params
     * @yields Tags
     */
    async *getTags(params = {}) {
        const { path, from = '', to = 'HEAD', since, all } = params;
        const tagRegex = /tag:\s*(.+?)[,)]/gi;
        const stdout = this.execStream('log', '--decorate', '--no-color', '--date-order', all && '--all', since && `--since=${since instanceof Date ? since.toISOString() : since}`, [from, to].filter(Boolean).join('..'), ...path ? ['--', ...toArray(path)] : []);
        let chunk;
        let matches;
        let tag;
        for await (chunk of stdout) {
            matches = chunk.toString().trim().matchAll(tagRegex);
            for ([, tag] of matches) {
                yield tag;
            }
        }
    }
    /**
     * Get last tag.
     * @param params
     * @returns Last tag, `null` if not found.
     */
    async getLastTag(params) {
        return firstFromStream(this.getTags(params));
    }
    /**
     * Check file is ignored via .gitignore.
     * @param file - Path to target file.
     * @returns Boolean value.
     */
    async checkIgnore(file) {
        try {
            await this.exec('check-ignore', '--', file);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Add files to git index.
     * @param files - Files to stage.
     */
    async add(files) {
        await this.exec('add', '--', ...toArray(files));
    }
    /**
     * Commit changes.
     * @param params
     * @param params.verify
     * @param params.sign
     * @param params.files
     * @param params.allowEmpty
     * @param params.message
     */
    async commit(params) {
        const { verify = true, sign = false, files = [], allowEmpty = false, message } = params;
        await this.exec('commit', !verify && '--no-verify', sign && '-S', allowEmpty && '--allow-empty', '-m', message, '--', ...files);
    }
    /**
     * Create a tag for the current commit.
     * @param params
     * @param params.sign
     * @param params.name
     * @param params.message
     */
    async tag(params) {
        let { sign = false, name, message } = params;
        if (sign) {
            message = '';
        }
        await this.exec('tag', sign && '-s', message && '-a', ...message ? ['-m', message] : [], '--', name);
    }
    /**
     * Get current branch name.
     * @returns Current branch name.
     */
    async getCurrentBranch() {
        const branch = await this.exec('rev-parse', '--abbrev-ref', 'HEAD');
        return branch;
    }
    /**
     * Get default branch name.
     * @returns Default branch name.
     */
    async getDefaultBranch() {
        const branch = (await this.exec('rev-parse', '--abbrev-ref', 'origin/HEAD')).replace(/^origin\//, '');
        return branch;
    }
    /**
     * Push changes to remote.
     * @param branch
     * @param params
     * @param params.verify
     */
    async push(branch, params = {}) {
        const { verify = true, tags = false, followTags = false, force = false } = params;
        await this.exec('push', followTags && '--follow-tags', tags && '--tags', !verify && '--no-verify', force && '--force', 'origin', '--', branch);
    }
    /**
     * Verify rev exists.
     * @param rev
     * @param safe - If `true`, will not throw error if rev not found.
     * @returns Target hash.
     */
    async verify(rev, safe) {
        let git = this.exec('rev-parse', '--verify', rev);
        if (safe) {
            git = git.catch(() => '');
        }
        return await git;
    }
    /**
     * Get config value by key.
     * @param key - Config key.
     * @returns Config value.
     */
    async getConfig(key) {
        return await this.exec('config', '--get', '--', key);
    }
    /**
     * Set config value by key.
     * @param key - Config key.
     * @param value - Config value.
     */
    async setConfig(key, value) {
        await this.exec('config', '--', key, value);
    }
    /**
     * Fetch changes from remote.
     * @param params
     */
    async fetch(params = {}) {
        const { prune = false, unshallow = false, tags = false, all = false, remote, branch } = params;
        await this.exec('fetch', prune && '--prune', unshallow && '--unshallow', tags && '--tags', all && '--all', ...remote && branch
            ? [
                '--',
                remote,
                branch
            ]
            : []);
    }
    /**
     * Create a new branch.
     * @param branch - Branch name.
     */
    async createBranch(branch) {
        await this.exec('checkout', '-b', branch);
    }
    /**
     * Delete a branch.
     * @param branch - Branch name.
     */
    async deleteBranch(branch) {
        await this.exec('branch', '-D', '--', branch);
    }
    /**
     * Checkout a branch.
     * @param branch - Branch name.
     */
    async checkout(branch) {
        await this.exec('checkout', branch);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2l0Q2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0dpdENsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBQ3JDLE9BQU8sRUFDTCxlQUFlLEVBQ2YsV0FBVyxFQUNaLE1BQU0sMkJBQTJCLENBQUE7QUFDbEMsT0FBTyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ2IsTUFBTSxrQ0FBa0MsQ0FBQTtBQVV6QyxPQUFPLEVBQ0wsVUFBVSxFQUNWLE9BQU8sRUFDUixNQUFNLFlBQVksQ0FBQTtBQUVuQixNQUFNLE9BQU8sR0FBRyxzREFBc0QsQ0FBQTtBQUV0RTs7R0FFRztBQUNILE1BQU0sT0FBTyxTQUFTO0lBRVQsR0FBRztJQUNMLEtBQUs7SUFGZCxZQUNXLEdBQVcsRUFDYixLQUErQjttQkFEN0IsR0FBRztxQkFDTCxLQUFLO0lBQ1gsQ0FBQztJQUVJLFVBQVUsQ0FBQyxHQUFHLElBQVc7UUFDL0IsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUE7UUFFckMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ3ZCLENBQUM7UUFFRCxPQUFPLFNBQVMsQ0FBQTtJQUNsQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFXO1FBQ3ZCLE9BQU8sQ0FDTCxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRTtZQUNsRCxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7U0FDZCxDQUFDLENBQUMsQ0FDSixDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ3JCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsVUFB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