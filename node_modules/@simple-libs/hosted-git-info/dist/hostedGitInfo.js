function getType(domain) {
    if (domain.includes('github')) {
        return 'github';
    }
    if (domain.includes('gitlab')) {
        return 'gitlab';
    }
    if (domain.includes('bitbucket')) {
        return 'bitbucket';
    }
    if (domain.includes('git.sr.ht')) {
        return 'sourcehut';
    }
    return '';
}
function getHost(type) {
    switch (type) {
        case 'github':
            return 'https://github.com';
        case 'gitlab':
            return 'https://gitlab.com';
        case 'bitbucket':
            return 'https://bitbucket.org';
        case 'sourcehut':
            return 'https://git.sr.ht';
        default:
            return '';
    }
}
function getRepositoryUrl(type, host, owner, project, branch) {
    if (!host) {
        return '';
    }
    let treepath = '';
    if (branch) {
        if (type === 'bitbucket') {
            treepath = `/src/${encodeURIComponent(branch)}`;
        }
        else {
            treepath = `/tree/${encodeURIComponent(branch)}`;
        }
    }
    return `${host}/${owner}/${project}${treepath}`;
}
/**
 * Parse hosted git url.
 * @param input - Git url. Different formats are supported.
 * @returns Parsed data or null if not supported.
 */
export function parseHostedGitUrl(input) {
    // github edge case with branch in the url
    let matches = input.match(/^(?:https:\/\/)?github\.com\/([^/]+)\/([^/.#]+)(?:\/tree\/[^/]+)?$/);
    if (matches) {
        return {
            url: input,
            type: 'github',
            host: 'https://github.com',
            owner: matches[1],
            project: matches[2]
        };
    }
    let type;
    let host;
    let owner;
    let project;
    // git+ssh and ssh urls
    matches = input.match(/^(?:(?:git\+)?ssh:\/\/(?:[^@]+@)?|[^@]+@)(?:www\.)?([^@:]+):([^/]+(?:\/[^/]+)?)\/([^/.#]+)(?:\.git)?(?:#(.+))?/);
    if (matches) {
        type = getType(matches[1]);
        host = `https://${matches[1]}`;
        owner = matches[2];
        project = matches[3];
        return {
            url: getRepositoryUrl(type, host, owner, project, matches[4]),
            type,
            host,
            owner,
            project
        };
    }
    // git+https and https urls
    matches = input.match(/^(?:(?:git\+)?https|git):\/\/(?:[^@]+@)?(?:www\.)?([^@/]+)\/([^/]+(?:\/[^/]+)*)\/([^/.#]+)(?:\.git)?(?:#(.+))?$/);
    if (matches) {
        type = getType(matches[1]);
        host = `http${type || input.includes('https://') ? 's' : ''}://${matches[1]}`;
        owner = matches[2];
        project = matches[3];
        return {
            url: getRepositoryUrl(type, host, owner, project, matches[4]),
            type,
            host,
            owner,
            project
        };
    }
    // shortcuts
    matches = input.match(/^(?:([^@:]+):)?(?:[^@:]+@|[^@:]*:[^@:]+@)?([^/#]+(?:\/[^/]+)?)\/([^/.#]+)(?:\.git)?(?:#(.+))?/);
    if (matches) {
        type = matches[1] || 'github';
        host = getHost(type);
        owner = matches[2];
        project = matches[3];
        return {
            url: getRepositoryUrl(type, host, owner, project, matches[4]),
            type,
            host,
            owner,
            project
        };
    }
    matches = input.match(/^\w+:\/\/([^/]+)(\/[^#]+)?/);
    if (matches) {
        type = getType(matches[1]);
        host = `http${type || input.includes('https://') ? 's' : ''}://${matches[1]}`;
        return {
            url: `${host}${matches[2]?.replace(/\/?\.git.*/, '') || ''}`,
            type,
            host
        };
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdGVkR2l0SW5mby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ob3N0ZWRHaXRJbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtBLFNBQVMsT0FBTyxDQUFDLE1BQWM7SUFDN0IsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDOUIsT0FBTyxRQUFRLENBQUE7SUFDakIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQzlCLE9BQU8sUUFBUSxDQUFBO0lBQ2pCLENBQUM7SUFFRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUNqQyxPQUFPLFdBQVcsQ0FBQTtJQUNwQixDQUFDO0lBRUQsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7UUFDakMsT0FBTyxXQUFXLENBQUE7SUFDcEIsQ0FBQztJQUVELE9BQU8sRUFBRSxDQUFBO0FBQ1gsQ0FBQztBQUVELFNBQVMsT0FBTyxDQUFDLElBQVk7SUFDM0IsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUNiLEtBQUssUUFBUTtZQUNYLE9BQU8sb0JBQW9CLENBQUE7UUFDN0IsS0FBSyxRQUFRO1lBQ1gsT0FBTyxvQkFBb0IsQ0FBQTtRQUM3QixLQUFLLFdBQVc7WUFDZCxPQUFPLHVCQUF1QixDQUFBO1FBQ2hDLEtBQUssV0FBVztZQUNkLE9BQU8sbUJBQW1CLENBQUE7UUFDNUI7WUFDRSxPQUFPLEVBQUUsQ0FBQTtJQUNiLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FDdkIsSUFBYyxFQUNkLElBQVksRUFDWixLQUFhLEVBQ2IsT0FBZSxFQUNmLE1BQWM7SUFFZCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDVixPQUFPLEVBQUUsQ0FBQTtJQUNYLENBQUM7SUFFRCxJQUFJLFFBQVEsR0FBRyxFQUFF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