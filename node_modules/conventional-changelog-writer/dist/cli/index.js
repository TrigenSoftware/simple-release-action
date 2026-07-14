#!/usr/bin/env node
import { pipeline } from 'stream/promises';
import { readFile } from 'fs/promises';
import { readOptions, option, flag, alias, rest } from 'argue-cli';
import { writeChangelog } from '../index.js';
import { loadDataFile, readCommitsFromFiles, readCommitsFromStdin } from './utils.js';
const HELP = `
  Usage
    conventional-changelog-writer <path> [<path> ...]
    cat <path> | conventional-changelog-writer

  Example
    conventional-changelog-writer commits.ldjson
    cat commits.ldjson | conventional-changelog-writer

  Options
    -c, --context    A filepath of a json that is used to define template variables
    -o, --options    A filepath of a javascript object that is used to define options
`;
const flags = readOptions(option(alias('context', 'c'), String), option(alias('options', 'o'), String), flag('help'), flag('version'));
const files = rest();
if (flags.help || flags.version) {
    const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));
    console.log(flags.help
        ? `\n  ${pkg.description}\n${HELP}`
        : pkg.version);
    process.exit(0);
}
const { context: contextPath, options: optionsPath } = flags;
let context;
let options;
if (contextPath) {
    try {
        context = await loadDataFile(contextPath);
    }
    catch (err) {
        console.error(`Failed to get context from file ${contextPath}:\n  ${err}`);
        process.exit(1);
    }
}
if (optionsPath) {
    try {
        options = await loadDataFile(optionsPath);
    }
    catch (err) {
        console.error(`Failed to get options from file ${optionsPath}:\n  ${err}`);
        process.exit(1);
    }
}
let inputStream;
try {
    if (files.length) {
        inputStream = readCommitsFromFiles(files);
    }
    else if (process.stdin.isTTY) {
        console.error('You must specify at least one line delimited json file');
        process.exit(1);
    }
    else {
        inputStream = readCommitsFromStdin();
    }
    await pipeline(inputStream, writeChangelog(context, options), process.stdout);
}
catch (err) {
    console.error(err);
    process.exit(1);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDMUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGFBQWEsQ0FBQTtBQUV0QyxPQUFPLEVBQ0wsV0FBVyxFQUNYLE1BQU0sRUFDTixJQUFJLEVBQ0osS0FBSyxFQUNMLElBQUksRUFDTCxNQUFNLFdBQVcsQ0FBQTtBQUNsQixPQUFPLEVBR0wsY0FBYyxFQUNmLE1BQU0sYUFBYSxDQUFBO0FBQ3BCLE9BQU8sRUFDTCxZQUFZLEVBQ1osb0JBQW9CLEVBQ3BCLG9CQUFvQixFQUNyQixNQUFNLFlBQVksQ0FBQTtBQUVuQixNQUFNLElBQUksR0FBRzs7Ozs7Ozs7Ozs7O0NBWVosQ0FBQTtBQUNELE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQ3JDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUNoQixDQUFBO0FBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUE7QUFFcEIsSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUNwQixNQUFNLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FJdkUsQ0FBQTtJQUVELE9BQU8sQ0FBQyxHQUFHLENBQ1QsS0FBSyxDQUFDLElBQUk7UUFDUixDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsV0FBVyxLQUFLLElBQUksRUFBRTtRQUNuQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FDaEIsQ0FBQTtJQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDakIsQ0FBQztBQUVELE1BQU0sRUFDSixPQUFPLEVBQUUsV0FBVyxFQUNwQixPQUFPLEVBQUUsV0FBVyxFQUNyQixHQUFHLEtBQUssQ0FBQTtBQUNULElBQUksT0FBb0MsQ0FBQTtBQUN4QyxJQUFJLE9BQTRCLENBQUE7QUFFaEMsSUFBSSxXQUFXLEVBQUUsQ0FBQztJQUNoQixJQUFJLENBQUM7UUFDSCxPQUFPLEdBQUcsTUFBTSxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxXQUFXLFFBQVEsR0FBYSxFQUFFLENBQUMsQ0FBQTtRQUNwRixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2pCLENBQUM7QUFDSCxDQUFDO0FBRUQsSUFBSSxXQUFXLEVBQUUsQ0FBQztJQUNoQixJQUFJLENBQUM7UUFDSCxPQUFPLEdBQUcsTUFBTSxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxXQUFXLFFBQVEsR0FBYSxFQUFFLENBQUMsQ0FBQTtRQUNwRixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2pCLENBQUM7QUFDSCxDQUFDO0FBRUQsSUFBSSxXQUE0QyxDQUFBO0FBRWhELElBQUksQ0FBQztJQUNILElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pCLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUMzQyxDQUFDO1NBQ0MsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQTtRQUN2RSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2pCLENBQUM7U0FBTSxDQUFDO1FBQ04sV0FBVyxHQUFHLG9CQUFvQixFQUFFLENBQUE7SUFDdEMsQ0FBQztJQUVILE1BQU0sUUFBUSxDQUNaLFdBQVcsRUFDWCxjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUNoQyxPQUFPLENBQUMsTUFBTSxDQUNmLENBQUE7QUFDSCxDQUFDO0FBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDbEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNqQixDQUFDIn0=