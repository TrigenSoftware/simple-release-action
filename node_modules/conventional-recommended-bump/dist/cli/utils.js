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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return (await import(resolvedFilePath)).default;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xpL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBQ3ZDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxLQUFLLENBQUE7QUFDbkMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGFBQWEsQ0FBQTtBQUV0QyxTQUFTLGVBQWUsQ0FBQyxRQUFnQjtJQUN2QyxPQUFPLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7QUFDeEQsQ0FBQztBQUVELE1BQU0sQ0FBQyxLQUFLLFVBQVUsWUFBWSxDQUFDLFFBQWdCO0lBQ2pELE1BQU0sZ0JBQWdCLEdBQUcsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ2xELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBRWhELElBQUksR0FBRyxLQUFLLE9BQU8sRUFBRTtRQUNuQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQVcsQ0FBQTtLQUN0RTtJQUVELGdFQUFnRTtJQUNoRSxzRUFBc0U7SUFDdEUsT0FBTyxDQUFDLE1BQU0sTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxPQUFpQixDQUFBO0FBQzNELENBQUMifQ==