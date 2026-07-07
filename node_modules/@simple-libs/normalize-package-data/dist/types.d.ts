export interface PackageRepository {
    type?: string;
    url?: string;
    directory?: string;
}
export interface PackageBugs {
    url?: string;
    email?: string;
}
export interface PackageData {
    name?: string;
    version?: string;
    repository?: string | PackageRepository | null;
    bugs?: string | PackageBugs | null;
    homepage?: string | null;
    [key: string]: any;
}
export interface NormalizedPackageData {
    name: string;
    version: string;
    repository?: PackageRepository | null;
    bugs?: PackageBugs | null;
    homepage?: string | null;
    [key: string]: any;
}
//# sourceMappingURL=types.d.ts.map