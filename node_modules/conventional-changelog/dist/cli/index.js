#!/usr/bin/env node
import { readFile } from 'fs/promises';
import { ConventionalChangelog } from '../index.js';
import { readFlags, runProgram } from './cli.js';
const HELP = `
  Usage
    conventional-changelog

  Example
    conventional-changelog -i changelog -o CHANGELOG.md

  Options
    -i, --infile              Read the CHANGELOG from this file (default: CHANGELOG.md)
    -o, --outfile             Write the CHANGELOG to this file (default: infile)
    --stdout                  Output the result to stdout
    -p, --preset              Name of the preset you want to use
    -k, --pkg                 A filepath of where your package.json is located (default: closest package.json)
    -a, --append              Should the newer release be appended to the older release (default: false)
    -f, --first-release       Generate the CHANGELOG for the first time
    -r, --release-count       How many releases to be generated from the latest (default: 1)
                              If 0, the whole changelog will be regenerated and the outfile will be overwritten
    --skip-unstable           If given, unstable tags will be skipped, e.g., x.x.x-alpha.1, x.x.x-rc.2
    -u, --output-unreleased   Output unreleased changelog
    -v, --verbose             Verbose output. Use this for debugging (default: false)
    -n, --config              A filepath of your config script
    -c, --context             A filepath of a json that is used to define template variables
    -l, --lerna-package       Generate a changelog for a specific lerna package (:pkg-name@1.0.0)
    -t, --tag-prefix          Tag prefix to consider when reading the tags
    --commit-path             Generate a changelog scoped to a specific directory
    --from                    Start commit range from a specific tag or sha
    --to                      End commit range at a specific tag or sha
`;
const flags = readFlags();
if (flags.help || flags.version) {
    const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));
    console.log(flags.help
        ? `\n  ${pkg.description}\n${HELP}`
        : pkg.version);
    process.exit(0);
}
await runProgram(new ConventionalChangelog(process.cwd()), flags);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sYUFBYSxDQUFBO0FBQ3RDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGFBQWEsQ0FBQTtBQUNuRCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDWCxNQUFNLFVBQVUsQ0FBQTtBQUVqQixNQUFNLElBQUksR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBMkJaLENBQUE7QUFDRCxNQUFNLEtBQUssR0FBRyxTQUFTLEVBQUUsQ0FBQTtBQUV6QixJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQ3BCLE1BQU0sUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLG9CQUFvQixFQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUl2RSxDQUFBO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FDVCxLQUFLLENBQUMsSUFBSTtRQUNSLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxXQUFXLEtBQUssSUFBSSxFQUFFO1FBQ25DLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUNoQixDQUFBO0lBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNqQixDQUFDO0FBRUQsTUFBTSxVQUFVLENBQ2QsSUFBSSxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsRUFDeEMsS0FBSyxDQUNOLENBQUEifQ==