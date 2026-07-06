#!/usr/bin/env node
import { pipeline } from 'stream/promises';
import meow from 'meow';
import { parseCommits } from '../index.js';
import { parseOptions } from './options.js';
import { readRawCommitsFromFiles, readRawCommitsFromLine, readRawCommitsFromStdin, stringify } from './utils.js';
const DEFAULT_SEPARATOR = '\n\n\n';
const cli = meow(`
    Practice writing commit messages or parse messages from files.
    If used without specifying a text file path, you will enter an interactive shell.
    Otherwise the commit messages in the files are parsed and printed
    By default, commits will be split by three newlines ('\\n\\n\\n') or you can specify a separator.

    Usage
      conventional-commits-parser [-s <commit-separator>]
      conventional-commits-parser [-s <commit-separator>] <path> [<path> ...]
      cat <path> | conventional-commits-parser [-s <commit-separator>]

    Example
      conventional-commits-parser
      conventional-commits-parser log.txt
      cat log.txt | conventional-commits-parser
      conventional-commits-parser log2.txt -s '===' >> parsed.txt

    Options
      -s, --separator                   Commit separator
      -p, --header-pattern              Regex to match header pattern
      -c, --header-correspondence       Comma separated parts used to define what capturing group of 'headerPattern' captures what
      -r, --reference-actions           Comma separated keywords that used to reference issues
      -i, --issue-prefixes              Comma separated prefixes of an issue
      --issue-prefixes-case-sensitive   Treat issue prefixes as case sensitive
      -n, --note-keywords               Comma separated keywords for important notes
      -f, --field-pattern               Regex to match other fields
      --revert-pattern                  Regex to match revert pattern
      --revert-correspondence           Comma separated fields used to define what the commit reverts
      -v, --verbose                     Verbose output
`, {
    importMeta: import.meta,
    flags: {
        separator: {
            shortFlag: 's',
            type: 'string',
            default: DEFAULT_SEPARATOR
        },
        headerPattern: {
            shortFlag: 'p',
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
        issuePrefixesCaseSensitive: {
            type: 'boolean'
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
        verbose: {
            shortFlag: 'v',
            type: 'boolean'
        }
    }
});
const { separator } = cli.flags;
const options = parseOptions(cli.flags);
let inputStream;
try {
    if (cli.input.length) {
        inputStream = readRawCommitsFromFiles(cli.input, separator);
    }
    else if (process.stdin.isTTY) {
        inputStream = readRawCommitsFromLine(separator);
    }
    else {
        inputStream = readRawCommitsFromStdin(separator);
    }
    await pipeline(inputStream, parseCommits(options), stringify, process.stdout);
}
catch (err) {
    console.error(err);
    process.exit(1);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDMUMsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFBO0FBQ3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUE7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQTtBQUMzQyxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLHNCQUFzQixFQUN0Qix1QkFBdUIsRUFDdkIsU0FBUyxFQUNWLE1BQU0sWUFBWSxDQUFBO0FBRW5CLE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFBO0FBQ2xDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0E2QmhCLEVBQUU7SUFDRCxVQUFVLEVBQUUsT0FBTyxJQUFJO0lBQ3ZCLEtBQUssRUFBRTtRQUNMLFNBQVMsRUFBRTtZQUNULFNBQVMsRUFBRSxHQUFHO1lBQ2QsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsaUJBQWlCO1NBQzNCO1FBQ0QsYUFBYSxFQUFFO1lBQ2IsU0FBUyxFQUFFLEdBQUc7WUFDZCxJQUFJLEVBQUUsUUFBUTtTQUNmO1FBQ0Qsb0JBQW9CLEVBQUU7WUFDcEIsU0FBUyxFQUFFLEdBQUc7WUFDZCxJQUFJLEVBQUUsUUFBUTtTQUNmO1FBQ0QsZ0JBQWdCLEVBQUU7WUFDaEIsU0FBUyxFQUFFLEdBQUc7WUFDZCxJQUFJLEVBQUUsUUFBUTtTQUNmO1FBQ0QsYUFBYSxFQUFFO1lBQ2IsU0FBUyxFQUFFLEdBQUc7WUFDZCxJQUFJLEVBQUUsUUFBUTtTQUNmO1FBQ0QsMEJBQTBCLEVBQUU7WUFDMUIsSUFBSSxFQUFFLFNBQVM7U0FDaEI7UUFDRCxZQUFZLEVBQUU7WUFDWixTQUFTLEVBQUUsR0FBRztZQUNkLElBQUksRUFBRSxRQUFRO1NBQ2Y7UUFDRCxZQUFZLEVBQUU7WUFDWixTQUFTLEVBQUUsR0FBRztZQUNkLElBQUksRUFBRSxRQUFRO1NBQ2Y7UUFDRCxhQUFhLEVBQUU7WUFDYixJQUFJLEVBQUUsUUFBUTtTQUNmO1FBQ0Qsb0JBQW9CLEVBQUU7WUFDcEIsSUFBSSxFQUFFLFFBQVE7U0FDZjtRQUNELE9BQU8sRUFBRTtZQUNQLFNBQVMsRUFBRSxHQUFHO1lBQ2QsSUFBSSxFQUFFLFNBQVM7U0FDaEI7S0FDRjtDQUNGLENBQUMsQ0FBQTtBQUNGLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFBO0FBQy9CLE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDdkMsSUFBSSxXQUFrQyxDQUFBO0FBRXRDLElBQUksQ0FBQztJQUNILElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNyQixXQUFXLEdBQUcsdUJBQXVCLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQTtJQUM3RCxDQUFDO1NBQ0MsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLFdBQVcsR0FBRyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUNqRCxDQUFDO1NBQU0sQ0FBQztRQUNOLFdBQVcsR0FBRyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUNsRCxDQUFDO0lBRUgsTUFBTSxRQUFRLENBQ1osV0FBVyxFQUNYLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFDckIsU0FBUyxFQUNULE9BQU8sQ0FBQyxNQUFNLENBQ2YsQ0FBQTtBQUNILENBQUM7QUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNsQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2pCLENBQUMifQ==