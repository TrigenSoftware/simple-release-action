import {} from 'conventional-changelog-writer';
import { hostsOptions } from './hosts/index.js';
export function getHostOptions(repository, context) {
    const host = context?.host;
    let type;
    if (!host || host === repository?.host) {
        type = repository?.type;
    }
    else {
        const match = host.match(/github|bitbucket|gitlab/i);
        type = match?.[0]?.toLowerCase();
    }
    if (type && (type in hostsOptions)) {
        return hostsOptions[type];
    }
    return null;
}
export function guessNextTag(previousTag, version = '') {
    if (previousTag) {
        if (previousTag.startsWith('v') && !version.startsWith('v')) {
            return `v${version}`;
        }
        if (!previousTag.startsWith('v') && version.startsWith('v')) {
            return version.replace(/^v/, '');
        }
        return version;
    }
    if (!version.startsWith('v')) {
        return `v${version}`;
    }
    return version;
}
export function isUnreleasedVersion(semverTags, version) {
    const [lastTag] = semverTags;
    return lastTag && version
        && (lastTag === version || lastTag === `v${version}`);
}
export const versionTagRegex = /tag:\s*(.*)[,)]/i;
export const defaultVersionRegex = /tag:\s*[v=]?(.*)[,)]/i;
export function defaultCommitTransform(commit, params) {
    const { tags, options: { formatDate } } = params;
    const prefix = tags?.prefix;
    const versionRegex = prefix
        ? new RegExp(`tag:\\s*[v=]?${prefix}(.*)[,)]`, 'i')
        : defaultVersionRegex;
    const { committerDate, gitTags } = commit;
    const patch = {
        committerDate: committerDate
            ? formatDate(committerDate)
            : committerDate
    };
    if (typeof gitTags === 'string') {
        const matches = gitTags.match(versionRegex);
        if (matches) {
            patch.version = matches[1];
        }
    }
    return patch;
}
export function bindLogNamespace(namespace, log) {
    return (messages) => log(namespace, messages);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFnQixNQUFNLCtCQUErQixDQUFBO0FBQzVELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTtBQVEvQyxNQUFNLFVBQVUsY0FBYyxDQUM1QixVQUFxRCxFQUNyRCxPQUFtQztJQUVuQyxNQUFNLElBQUksR0FBRyxPQUFPLEVBQUUsSUFBSSxDQUFBO0lBQzFCLElBQUksSUFBSSxDQUFBO0lBRVIsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEtBQUssVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ3ZDLElBQUksR0FBRyxVQUFVLEVBQUUsSUFBSSxDQUFBO0lBQ3pCLENBQUM7U0FBTSxDQUFDO1FBQ04sTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO1FBRXBELElBQUksR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksWUFBWSxDQUFDLEVBQUUsQ0FBQztRQUNuQyxPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMzQixDQUFDO0lBRUQsT0FBTyxJQUFJLENBQUE7QUFDYixDQUFDO0FBRUQsTUFBTSxVQUFVLFlBQVksQ0FDMUIsV0FBbUIsRUFDbkIsT0FBTyxHQUFHLEVBQUU7SUFFWixJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ2hCLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUM1RCxPQUFPLElBQUksT0FBTyxFQUFFLENBQUE7UUFDdEIsQ0FBQztRQUVELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUM1RCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ2xDLENBQUM7UUFFRCxPQUFPLE9BQU8sQ0FBQTtJQUNoQixDQUFDO0lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUM3QixPQUFPLElBQUksT0FBTyxFQUFFLENBQUE7SUFDdEIsQ0FBQztJQUVELE9BQU8sT0FBTyxDQUFBO0FBQ2hCLENBQUM7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQ2pDLFVBQW9CLEVBQ3BCLE9BQTJCO0lBRTNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxVQUFVLENBQUE7SUFFNUIsT0FBTyxPQUFPLElBQUksT0FBTztXQUNwQixDQUFDLE9BQU8sS0FBSyxPQUFPLElBQUksT0FBTyxLQUFLLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBQTtBQUN6RCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLGtCQUFrQixDQUFBO0FBQ2pELE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHLHVCQUF1QixDQUFBO0FBRTFELE1BQU0sVUFBVSxzQkFBc0IsQ0FBQyxNQUFjLEVBQUUsTUFBYztJQUNuRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEdBQUcsTUFBTSxDQUFBO0lBQ2hELE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxNQUFNLENBQUE7SUFDM0IsTUFBTSxZQUFZLEdBQUcsTUFBTTtRQUN6QixDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLE1BQU0sVUFBVSxFQUFFLEdBQUcsQ0FBQztRQUNuRCxDQUFDLENBQUMsbUJBQW1CLENBQUE7SUFDdkIsTUFBTSxFQUNKLGFBQWEsRUFDYixPQUFPLEVBQ1IsR0FBRyxNQUFNLENBQUE7SUFDVixNQUFNLEtBQUssR0FBb0I7UUFDN0IsYUFBYSxFQUFFLGFBQWE7WUFDMUIsQ0FBQyxDQUFDLFVBQVcsQ0FBQyxhQUFhLENBQUM7WUFDNUIsQ0FBQyxDQUFDLGFBQWE7S0FDbEIsQ0FBQTtJQUVELElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDaEMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUUzQyxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ1osS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDNUIsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLEtBQUssQ0FBQTtBQUNkLENBQUM7QUFFRCxNQUFNLFVBQVUsZ0JBQWdCLENBQzlCLFNBQWlCLEVBQ2pCLEdBQVc7SUFFWCxPQUFPLENBQUMsUUFBMkIsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUNsRSxDQUFDIn0=