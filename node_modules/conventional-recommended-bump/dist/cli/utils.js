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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxFQUNMLE9BQU8sRUFDUCxPQUFPLEVBQ1IsTUFBTSxNQUFNLENBQUE7QUFDYixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sS0FBSyxDQUFBO0FBQ25DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxhQUFhLENBQUE7QUFFdEMsU0FBUyxlQUFlLENBQUMsUUFBZ0I7SUFDdkMsT0FBTyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0FBQ3hELENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFVLFlBQVksQ0FBQyxRQUFnQjtJQUNqRCxNQUFNLGdCQUFnQixHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNsRCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUVoRCxJQUFJLEdBQUcsS0FBSyxPQUFPLEVBQUUsQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQVcsQ0FBQTtJQUN2RSxDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLDhEQUE4RDtJQUM5RCxPQUFPLENBQUMsTUFBTSxNQUFNLGtDQUFDLGdCQUFnQixFQUFDLENBQUMsQ0FBQyxPQUFpQixDQUFBO0FBQzNELENBQUMifQ==