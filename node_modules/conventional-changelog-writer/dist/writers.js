import { Transform } from 'stream';
import { createTemplateRenderer } from './template.js';
import { getFinalContext } from './context.js';
import { getFinalOptions, getGenerateOnFunction } from './options.js';
import { transformCommit } from './commit.js';
export function writeChangelog(context = {}, options = {}, includeDetails = false) {
    const finalOptions = getFinalOptions(options);
    const finalContext = getFinalContext(context, finalOptions);
    const generateOn = getGenerateOnFunction(finalContext, finalOptions);
    const renderTemplate = createTemplateRenderer(finalContext, finalOptions);
    const prepResult = includeDetails
        ? (log, keyCommit) => ({
            log,
            keyCommit
        })
        : (log) => log;
    return async function* write(commits) {
        const { transform, reverse, doFlush, skip } = finalOptions;
        let chunk;
        let commit;
        let keyCommit;
        let commitsGroup = [];
        let neverGenerated = true;
        let result = '';
        let savedKeyCommit = null;
        let firstRelease = true;
        for await (chunk of commits) {
            commit = await transformCommit(chunk, transform, finalContext, finalOptions);
            keyCommit = commit || chunk;
            if (skip?.(keyCommit)) {
                continue;
            }
            // previous blocks of logs
            if (reverse) {
                if (commit) {
                    commitsGroup.push(commit);
                }
                if (generateOn(keyCommit, commitsGroup)) {
                    neverGenerated = false;
                    result = await renderTemplate(commitsGroup, keyCommit, result.length > 0);
                    commitsGroup = [];
                    yield prepResult(result, keyCommit);
                }
            }
            else {
                if (generateOn(keyCommit, commitsGroup)) {
                    neverGenerated = false;
                    result = await renderTemplate(commitsGroup, savedKeyCommit, result.length > 0);
                    commitsGroup = [];
                    if (!firstRelease || doFlush) {
                        yield prepResult(result, savedKeyCommit);
                    }
                    firstRelease = false;
                    savedKeyCommit = keyCommit;
                }
                if (commit) {
                    commitsGroup.push(commit);
                }
            }
        }
        if (!doFlush && (reverse || neverGenerated)) {
            return;
        }
        result = await renderTemplate(commitsGroup, savedKeyCommit, result.length > 0);
        yield prepResult(result, savedKeyCommit);
    };
}
/**
 * Creates a transform stream which takes commits and outputs changelog entries.
 * @param context - TemplateContext for changelog template.
 * @param options - Options for changelog template.
 * @param includeDetails - Whether to emit details object instead of changelog entry.
 * @returns Transform stream which takes commits and outputs changelog entries.
 */
export function writeChangelogStream(context, options, includeDetails = false) {
    return Transform.from(writeChangelog(context, options, includeDetails));
}
/**
 * Create a changelog string from commits.
 * @param commits - Commits to generate changelog from.
 * @param context - TemplateContext for changelog template.
 * @param options - Options for changelog template.
 * @returns Changelog string.
 */
export async function writeChangelogString(commits, context, options) {
    const changelogAsyncIterable = writeChangelog(context, options)(commits);
    let changelog = '';
    let chunk;
    for await (chunk of changelogAsyncIterable) {
        changelog += chunk;
    }
    return changelog;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JpdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy93cml0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxRQUFRLENBQUE7QUFVbEMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sZUFBZSxDQUFBO0FBQ3RELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxjQUFjLENBQUE7QUFDOUMsT0FBTyxFQUNMLGVBQWUsRUFDZixxQkFBcUIsRUFDdEIsTUFBTSxjQUFjLENBQUE7QUFDckIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGFBQWEsQ0FBQTtBQXlCN0MsTUFBTSxVQUFVLGNBQWMsQ0FDNUIsT0FBTyxHQUE0QixFQUFFLEVBQ3JDLE9BQU8sR0FBb0IsRUFBRSxFQUM3QixjQUFjLEdBQUcsS0FBSztJQUV0QixNQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDN0MsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQTtJQUMzRCxNQUFNLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUE7SUFDcEUsTUFBTSxjQUFjLEdBQUcsc0JBQXNCLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFBO0lBQ3pFLE1BQU0sVUFBVSxHQUFHLGNBQWM7UUFDL0IsQ0FBQyxDQUFDLENBQUMsR0FBVyxFQUFFLFNBQXdCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUMsR0FBRztZQUNILFNBQVM7U0FDVixDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUE7SUFFeEIsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDMUIsT0FBaUQ7UUFFakQsTUFBTSxFQUNKLFNBQVMsRUFDVCxPQUFPLEVBQ1AsT0FBTyxFQUNQLElBQUksRUFDTCxHQUFHLFlBQVksQ0FBQTtRQUNoQixJQUFJLEtBQWEsQ0FBQTtRQUNqQixJQUFJLE1BQXdDLENBQUE7UUFDNUMsSUFBSSxTQUF3QixDQUFBO1FBQzVCLElBQUksWUFBWSxHQUFnQyxFQUFFLENBQUE7UUFDbEQsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFBO1FBQ3pCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQTtRQUNmLElBQUksY0FBYyxHQUFrQixJQUFJLENBQUE7UUFDeEMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFBO1FBRXZCLElBQUksS0FBSyxFQUFFLEtBQUssSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUM1QixNQUFNLEdBQUcsTUFBTSxlQUFlLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUE7WUFDNUUsU0FBUyxHQUFHLE1BQU0sSUFBSSxLQUFLLENBQUE7WUFFM0IsSUFBSSxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO2dCQUN0QixTQUFRO1lBQ1YsQ0FBQztZQUVELDBCQUEwQjtZQUMxQixJQUFJLE9BQU8sRUFBRSxDQUFDO2dCQUNaLElBQUksTUFBTSxFQUFFLENBQUM7b0JBQ1gsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDM0IsQ0FBQztnQkFFRCxJQUFJLFVBQVUsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEVBQUUsQ0FBQztvQkFDeEMsY0FBYyxHQUFHLEtBQUssQ0FBQTtvQkFDdEIsTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTtvQkFDekUsWUFBWSxHQUFHLEVBQUUsQ0FBQTtvQkFFakIsTUFBTSxVQUFVLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO2dCQUNyQyxDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLElBQUksVUFBVSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsRUFBRSxDQUFDO29CQUN4QyxjQUFjLEdBQUcsS0FBSyxDQUFBO29CQUN0QixNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFBO29CQUM5RSxZQUFZLEdBQUcsRUFBRSxDQUFBO29CQUVqQixJQUFJLENBQUMsWUFBWSxJQUFJLE9BQU8sRUFBRSxDQUFDO3dCQUM3QixNQUFNLFVBQVUsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUE7b0JBQzFDLENBQUM7b0JBRUQsWUFBWSxHQUFHLEtBQUssQ0FBQTtvQkFDcEIsY0FBYyxHQUFHLFNBQVMsQ0FBQTtnQkFDNUIsQ0FBQztnQkFFRCxJQUFJLE1BQU0sRUFBRSxDQUFDO29CQUNYLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBQzNCLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUVELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLElBQUksY0FBYyxDQUFDLEVBQUUsQ0FBQztZQUM1QyxPQUFNO1FBQ1IsQ0FBQztRQUVELE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxZQUFZLEVBQUUsY0FBYyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFFOUUsTUFBTSxVQUFVLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFBO0lBQzFDLENBQUMsQ0FBQTtBQUNILENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsb0JBQW9CLENBQ2xDLE9BQWlDLEVBQ2pDLE9BQXlCLEVBQ3pCLGNBQWMsR0FBRyxLQUFLO0lBRXRCLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFBO0FBQ3pFLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLG9CQUFvQixDQUN4QyxPQUFpRCxFQUNqRCxPQUFpQyxFQUNqQyxPQUF5QjtJQUV6QixNQUFNLHNCQUFzQixHQUFHLGNBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDeEUsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFBO0lBQ2xCLElBQUksS0FBYSxDQUFBO0lBRWpCLElBQUksS0FBSyxFQUFFLEtBQUssSUFBSSxzQkFBc0IsRUFBRSxDQUFDO1FBQzNDLFNBQVMsSUFBSSxLQUFLLENBQUE7SUFDcEIsQ0FBQztJQUVELE9BQU8sU0FBUyxDQUFBO0FBQ2xCLENBQUMifQ==