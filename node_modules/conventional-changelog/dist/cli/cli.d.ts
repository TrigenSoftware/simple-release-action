#!/usr/bin/env node
import type { ConventionalChangelog } from '../index.js';
export declare function readFlags(): Partial<{
    append: boolean;
    commitPath: string;
    config: string;
    context: string;
    firstRelease: boolean;
    from: string;
    help: boolean;
    infile: string;
    lernaPackage: string;
    outfile: string;
    outputUnreleased: boolean;
    pkg: string;
    preset: string;
    releaseCount: number;
    skipUnstable: boolean;
    stdout: boolean;
    tagPrefix: string;
    to: string;
    verbose: boolean;
    version: boolean;
}>;
export type Flags = ReturnType<typeof readFlags>;
export declare function runProgram(generator: ConventionalChangelog, flags: Flags): Promise<void>;
//# sourceMappingURL=cli.d.ts.map