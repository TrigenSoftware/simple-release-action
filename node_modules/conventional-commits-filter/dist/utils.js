/**
 * Match commit with revert data
 * @param object - Commit object
 * @param source - Revert data
 * @returns `true` if commit matches revert data, otherwise `false`
 */
export function isMatch(object, source) {
    let aValue;
    let bValue;
    for (const key in source) {
        aValue = object[key];
        bValue = source[key];
        if (typeof aValue === 'string') {
            aValue = aValue.trim();
        }
        if (typeof bValue === 'string') {
            bValue = bValue.trim();
        }
        if (aValue !== bValue) {
            return false;
        }
    }
    return true;
}
/**
 * Find revert commit in set
 * @param commit
 * @param reverts
 * @returns Revert commit if found, otherwise `null`
 */
export function findRevertCommit(commit, reverts) {
    if (!reverts.size) {
        return null;
    }
    const rawCommit = commit.raw || commit;
    for (const revertCommit of reverts) {
        if (revertCommit.revert && isMatch(rawCommit, revertCommit.revert)) {
            return revertCommit;
        }
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0E7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsT0FBTyxDQUNyQixNQUFpQixFQUNqQixNQUFpQjtJQUVqQixJQUFJLE1BQWUsQ0FBQTtJQUNuQixJQUFJLE1BQWUsQ0FBQTtJQUVuQixLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQ3pCLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDcEIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUVwQixJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQy9CLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDeEIsQ0FBQztRQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDL0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUN4QixDQUFDO1FBRUQsSUFBSSxNQUFNLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDdEIsT0FBTyxLQUFLLENBQUE7UUFDZCxDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGdCQUFnQixDQUFtQixNQUFTLEVBQUUsT0FBZTtJQUMzRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2xCLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUVELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFBO0lBRXRDLEtBQUssTUFBTSxZQUFZLElBQUksT0FBTyxFQUFFLENBQUM7UUFDbkMsSUFBSSxZQUFZLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDbkUsT0FBTyxZQUFZLENBQUE7UUFDckIsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLElBQUksQ0FBQTtBQUNiLENBQUMifQ==