import { Transform } from 'stream';
import { RevertedCommitsFilter } from './RevertedCommitsFilter.js';
/**
 * Filter reverted commits.
 * @param commits
 * @yields Commits without reverted commits.
 */
export async function* filterRevertedCommits(commits) {
    const filter = new RevertedCommitsFilter();
    for await (const commit of commits) {
        yield* filter.process(commit);
    }
    yield* filter.flush();
}
/**
 * Filter reverted commits synchronously.
 * @param commits
 * @yields Commits without reverted commits.
 */
export function* filterRevertedCommitsSync(commits) {
    const filter = new RevertedCommitsFilter();
    for (const commit of commits) {
        yield* filter.process(commit);
    }
    yield* filter.flush();
}
/**
 * Filter reverted commits stream.
 * @returns Reverted commits filter stream.
 */
export function filterRevertedCommitsStream() {
    return Transform.from(filterRevertedCommits);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9maWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxRQUFRLENBQUE7QUFFbEMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUE7QUFFbEU7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLHFCQUFxQixDQUcxQyxPQUF1QztJQUV2QyxNQUFNLE1BQU0sR0FBRyxJQUFJLHFCQUFxQixFQUFLLENBQUE7SUFFN0MsSUFBSSxLQUFLLEVBQUUsTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFLENBQUM7UUFDbkMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUMvQixDQUFDO0lBRUQsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3ZCLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxTQUFTLENBQUMsQ0FBQyx5QkFBeUIsQ0FHeEMsT0FBb0I7SUFFcEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBcUIsRUFBSyxDQUFBO0lBRTdDLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFLENBQUM7UUFDN0IsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUMvQixDQUFDO0lBRUQsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3ZCLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsMkJBQTJCO0lBQ3pDLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBQzlDLENBQUMifQ==