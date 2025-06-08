#!/usr/bin/env node
import meow from 'meow';
import { Bumper } from '../index.js';
import { parseCommitsOptions, parseTagsOptions, parseParserOptions } from './options.js';
import { loadDataFile } from './utils.js';
const cli = meow(`
    Usage
      conventional-recommended-bump

    Example
      conventional-recommended-bump

    Options
      -p, --preset                   Name of the preset you want to use
      -g, --config                   A filepath of your config script
      -h, --header-pattern           Regex to match header pattern
      -c, --header-correspondence    Comma separated parts used to define what capturing group of 'headerPattern' captures what
      -r, --reference-actions        Comma separated keywords that used to reference issues
      -i, --issue-prefixes           Comma separated prefixes of an issue
      -n, --note-keywords            Comma separated keywords for important notes
      -f, --field-pattern            Regex to match other fields
      -v, --verbose                  Verbose output
      -l, --lerna-package            Recommend a bump for a specific lerna package (:pkg-name@1.0.0)
      -t, --tag-prefix               Tag prefix to consider when reading the tags
      --commit-path                  Recommend a bump scoped to a specific directory
      --skip-unstable                If given, unstable tags will be skipped, e.g., x.x.x-alpha.1, x.x.x-rc.2
`, {
    importMeta: import.meta,
    flags: {
        preset: {
            shortFlag: 'p',
            type: 'string'
        },
        config: {
            shortFlag: 'g',
            type: 'string'
        },
        verbose: {
            shortFlag: 'v',
            type: 'boolean'
        },
        // tags `prefix` param
        lernaPackage: {
            shortFlag: 'l',
            type: 'string'
        },
        // tags `prefix` param
        tagPrefix: {
            shortFlag: 't',
            type: 'string'
        },
        // tags `skipUnstable` param
        skipUnstable: {
            type: 'boolean'
        },
        // commits `path` param
        commitPath: {
            type: 'string'
        },
        // parser options
        headerPattern: {
            shortFlag: 'h',
            type: 'string'
        },
        headerCorrespondence: {
            shortFlag: 'c',
            type: 'string'
        },
        referenceActions: {
            shortFlag: 'r',
            type: 'string'
        },
        issuePrefixes: {
            shortFlag: 'i',
            type: 'string'
        },
        noteKeywords: {
            shortFlag: 'n',
            type: 'string'
        },
        fieldPattern: {
            shortFlag: 'f',
            type: 'string'
        },
        revertPattern: {
            type: 'string'
        },
        revertCorrespondence: {
            type: 'string'
        },
        mergePattern: {
            type: 'string'
        }
    }
});
const { flags } = cli;
const { preset, config } = flags;
const bumper = new Bumper(process.cwd());
let whatBump;
if (preset) {
    bumper.loadPreset(preset);
}
if (config) {
    const configOptions = await loadDataFile(config);
    if (configOptions.tags) {
        bumper.tag(configOptions.tags);
    }
    if (configOptions.commits || configOptions.parser) {
        bumper.commits(configOptions.commits || {}, configOptions.parser);
    }
    whatBump ||= configOptions.whatBump;
}
const tagsOptions = parseTagsOptions(flags);
if (tagsOptions) {
    bumper.tag(tagsOptions);
}
const commitsOptions = parseCommitsOptions(flags);
const parserOptions = parseParserOptions(flags);
if (commitsOptions) {
    bumper.commits(commitsOptions, parserOptions || undefined);
}
const data = await bumper.bump(whatBump);
if ('releaseType' in data) {
    console.log(data.releaseType);
}
if (flags.verbose && 'reason' in data) {
    console.log(`Reason: ${data.reason}`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLElBQUksTUFBTSxNQUFNLENBQUE7QUFFdkIsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQTtBQUNwQyxPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLGdCQUFnQixFQUNoQixrQkFBa0IsRUFDbkIsTUFBTSxjQUFjLENBQUE7QUFDckIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUV6QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXFCaEIsRUFBRTtJQUNELFVBQVUsRUFBRSxNQUFNLENBQUMsSUFBSTtJQUN2QixLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUU7WUFDTixTQUFTLEVBQUUsR0FBRztZQUNkLElBQUksRUFBRSxRQUFRO1NBQ2Y7UUFDRCxNQUFNLEVBQUU7WUFDTixTQUFTLEVBQUUsR0FBRztZQUNkLElBQUksRUFBRSxRQUFRO1NBQ2Y7UUFDRCxPQUFPLEVBQUU7WUFDUCxTQUFTLEVBQUUsR0FBRztZQUNkLElBQUksRUFBRSxTQUFTO1NBQ2hCO1FBQ0Qsc0JBQXNCO1FBQ3RCLFlBQVksRUFBRTtZQUNaLFNBQVMsRUFBRSxHQUFHO1lBQ2QsSUFBSSxFQUFFLFFBQVE7U0FDZjtRQUNELHNCQUFzQjtRQUN0QixTQUFTLEVBQUU7WUFDVCxTQUFTLEVBQUUsR0FBRztZQUNkLElBQUksRUFBRSxRQUFRO1NBQ2Y7UUFDRCw0QkFBNEI7UUFDNUIsWUFBWSxFQUFFO1lBQ1osSUFBSSxFQUFFLFNBQVM7U0FDaEI7UUFDRCx1QkFBdUI7UUFDdkIsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLFFBQVE7U0FDZjtRQUNELGlCQUFpQjtRQUNqQixhQUFhLEVBQUU7WUFDYixTQUFTLEVBQUUsR0FBRztZQUNkLElBQUksRUFBRSxRQUFR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