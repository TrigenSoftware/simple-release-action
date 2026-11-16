var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
import { resolve, extname } from 'path';
import { pathToFileURL } from 'url';
import { readFile } from 'fs/promises';
import { parseJsonStream } from '@simple-libs/stream-utils';
export async function* readCommitsFromFiles(files) {
    for (const file of files) {
        try {
            yield JSON.parse(await readFile(file, 'utf8'));
        }
        catch (err) {
            console.warn(`Failed to read file ${file}:\n  ${err}`);
        }
    }
}
export function readCommitsFromStdin() {
    return parseJsonStream(process.stdin);
}
function relativeResolve(filePath) {
    return pathToFileURL(resolve(process.cwd(), filePath));
}
export async function loadDataFile(filePath) {
    const resolvedFilePath = relativeResolve(filePath);
    const ext = extname(resolvedFilePath.toString());
    if (ext === '.json') {
        return JSON.parse(await readFile(resolvedFilePath, 'utf8'));
    }
    // @ts-expect-error Dynamic import actually works with file URLs
    // oxlint-disable-next-line typescript/no-unsafe-member-access
    return (await import(__rewriteRelativeImportExtension(resolvedFilePath))).default;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxFQUNMLE9BQU8sRUFDUCxPQUFPLEVBQ1IsTUFBTSxNQUFNLENBQUE7QUFDYixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBQ25DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxhQUFhLENBQUE7QUFDdEMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFBO0FBRTNELE1BQU0sQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLG9CQUFvQixDQUFJLEtBQWU7SUFDNUQsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUM7WUFDSCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFNLENBQUE7UUFDckQsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsSUFBSSxDQUFDLHVCQUF1QixJQUFJLFFBQVEsR0FBYSxFQUFFLENBQUMsQ0FBQTtRQUNsRSxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUsb0JBQW9CO0lBQ2xDLE9BQU8sZUFBZSxDQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMxQyxDQUFDO0FBRUQsU0FBUyxlQUFlLENBQUMsUUFBZ0I7SUFDdkMsT0FBTyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0FBQ3hELENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLFlBQVksQ0FBQyxRQUFnQjtJQUNqRCxNQUFNLGdCQUFnQixHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNsRCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUVoRCxJQUFJLEdBQUcsS0FBSyxPQUFPLEVBQUUsQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQVcsQ0FBQTtJQUN2RSxDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLDhEQUE4RDtJQUM5RCxPQUFPLENBQUMsTUFBTSxNQUFNLGtDQUFDLGdCQUFnQixFQUFDLENBQUMsQ0FBQyxPQUFpQixDQUFBO0FBQzNELENBQUMifQ==