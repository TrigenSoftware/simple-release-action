import { findRevertCommit } from './utils.js';
export class RevertedCommitsFilter {
    hold = new Set();
    holdRevertsCount = 0;
    /**
     * Process commit to filter reverted commits
     * @param commit
     * @yields Commit
     */
    *process(commit) {
        const { hold } = this;
        const revertCommit = findRevertCommit(commit, hold);
        if (revertCommit) {
            hold.delete(revertCommit);
            this.holdRevertsCount--;
            return;
        }
        if (commit.revert) {
            hold.add(commit);
            this.holdRevertsCount++;
            return;
        }
        if (this.holdRevertsCount > 0) {
            hold.add(commit);
        }
        else {
            if (hold.size) {
                yield* hold;
                hold.clear();
            }
            yield commit;
        }
    }
    /**
     * Flush all held commits
     * @yields Held commits
     */
    *flush() {
        const { hold } = this;
        if (hold.size) {
            yield* hold;
            hold.clear();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmV2ZXJ0ZWRDb21taXRzRmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1JldmVydGVkQ29tbWl0c0ZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxZQUFZLENBQUE7QUFFN0MsTUFBTSxPQUFPLHFCQUFxQjtJQUNmLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBSyxDQUFBO0lBQzVCLGdCQUFnQixHQUFHLENBQUMsQ0FBQztJQUU3Qjs7OztPQUlHO0lBQ0gsQ0FBRSxPQUFPLENBQUMsTUFBUztRQUNqQixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFBO1FBQ3JCLE1BQU0sWUFBWSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUVuRCxJQUFJLFlBQVksRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUE7WUFDekIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUE7WUFDdkIsT0FBTTtRQUNSLENBQUM7UUFFRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ2hCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1lBQ3ZCLE9BQU07UUFDUixDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNsQixDQUFDO2FBQU0sQ0FBQztZQUNOLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNkLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQTtnQkFDWCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7WUFDZCxDQUFDO1lBRUQsTUFBTSxNQUFNLENBQUE7UUFDZCxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILENBQUUsS0FBSztRQUNMLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUE7UUFFckIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZCxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUE7WUFDWCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDZCxDQUFDO0lBQ0gsQ0FBQztDQUNGIn0=