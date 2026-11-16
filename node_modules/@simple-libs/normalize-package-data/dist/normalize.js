import { parseHostedGitUrl } from '@simple-libs/hosted-git-info';
import cleanSemver from 'semver/functions/clean.js';
import validSemver from 'semver/functions/valid.js';
import { hasProtocol, isEmail } from './utils.js';
function normalizeName(name) {
    return name
        ? String(name).trim()
        : '';
}
function normalizeVersion(version) {
    if (!version) {
        return '';
    }
    if (validSemver(version, true)) {
        return cleanSemver(version, true) || version;
    }
    return version;
}
function normalizeRepository(repository) {
    if (!repository) {
        return repository === null
            ? null
            : undefined;
    }
    const normalizedRepository = typeof repository === 'string'
        ? {
            type: 'git',
            url: repository
        }
        : {
            ...repository
        };
    if (!normalizedRepository.url) {
        return normalizedRepository;
    }
    const hosted = parseHostedGitUrl(normalizedRepository.url);
    if (hosted) {
        normalizedRepository.url = hosted.url;
    }
    return normalizedRepository;
}
function normalizeBugs(bugs, repository) {
    if (!bugs && repository?.url) {
        const hosted = parseHostedGitUrl(repository.url);
        if (hosted?.type && hosted.project) {
            return {
                url: `${hosted.url}/issues`
            };
        }
        return bugs === null
            ? null
            : undefined;
    }
    if (!bugs) {
        return bugs === null
            ? null
            : undefined;
    }
    if (typeof bugs === 'string') {
        if (isEmail(bugs)) {
            return {
                email: bugs
            };
        }
        if (hasProtocol(bugs)) {
            return {
                url: bugs
            };
        }
        return undefined;
    }
    const normalizedBugs = {
        ...bugs
    };
    if (!normalizedBugs.email && !normalizedBugs.url) {
        return undefined;
    }
    return normalizedBugs;
}
function normalizeHomepage(homepage, repository) {
    if (!homepage && repository?.url) {
        const hosted = parseHostedGitUrl(repository.url);
        if (hosted?.type && hosted.project) {
            return `${hosted.url}#readme`;
        }
        return homepage;
    }
    if (!homepage) {
        return homepage;
    }
    if (typeof homepage !== 'string') {
        return undefined;
    }
    if (!hasProtocol(homepage)) {
        return `http://${homepage}`;
    }
    return homepage;
}
/**
 * Normalizes package metadata into the shape expected by npm-style package data.
 *
 * The input object is not mutated. Unknown fields are preserved, while known
 * fields such as `name`, `version`, `repository`, `bugs`, and `homepage` are
 * normalized when possible.
 *
 * @param pkg - Package metadata to normalize.
 * @returns Normalized package metadata.
 */
export function normalizePackageData(pkg) {
    const repository = normalizeRepository(pkg.repository);
    const bugs = normalizeBugs(pkg.bugs, repository);
    const homepage = normalizeHomepage(pkg.homepage, repository);
    const normalizedPackage = {
        ...pkg,
        name: normalizeName(pkg.name),
        version: normalizeVersion(pkg.version),
        repository,
        bugs,
        homepage
    };
    if (typeof bugs === 'undefined') {
        delete normalizedPackage.bugs;
    }
    if (typeof homepage === 'undefined') {
        delete normalizedPackage.homepage;
    }
    return normalizedPackage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ybWFsaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL25vcm1hbGl6ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQTtBQUNoRSxPQUFPLFdBQVcsTUFBTSwyQkFBMkIsQ0FBQTtBQUNuRCxPQUFPLFdBQVcsTUFBTSwyQkFBMkIsQ0FBQTtBQU9uRCxPQUFPLEVBQ0wsV0FBVyxFQUNYLE9BQU8sRUFDUixNQUFNLFlBQVksQ0FBQTtBQUVuQixTQUFTLGFBQWEsQ0FBQyxJQUF5QjtJQUM5QyxPQUFPLElBQUk7UUFDVCxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRTtRQUNyQixDQUFDLENBQUMsRUFBRSxDQUFBO0FBQ1IsQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsT0FBK0I7SUFDdkQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsT0FBTyxFQUFFLENBQUE7SUFDWCxDQUFDO0lBRUQsSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDL0IsT0FBTyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQTtJQUM5QyxDQUFDO0lBRUQsT0FBTyxPQUFPLENBQUE7QUFDaEIsQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQUMsVUFBcUM7SUFDaEUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2hCLE9BQU8sVUFBVSxLQUFLLElBQUk7WUFDeEIsQ0FBQyxDQUFDLElBQUk7WUFDTixDQUFDLENBQUMsU0FBUyxDQUFBO0lBQ2YsQ0FBQztJQUVELE1BQU0sb0JBQW9CLEdBQXNCLE9BQU8sVUFBVSxLQUFLLFFBQVE7UUFDNUUsQ0FBQyxDQUFDO1lBQ0EsSUFBSSxFQUFFLEtBQUs7WUFDWCxHQUFHLEVBQUUsVUFBVTtTQUNoQjtRQUNELENBQUMsQ0FBQztZQUNB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