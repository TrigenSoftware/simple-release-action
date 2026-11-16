import { getTemplateContext } from './context.js';
/**
 * Create template renderer.
 * @param context
 * @param options
 * @returns Template render function.
 */
export function createTemplateRenderer(context, options) {
    const { template } = options;
    return async (commits, keyCommit, subsequent) => {
        const templateContext = await getTemplateContext(keyCommit, commits, context, options);
        const rendered = (await template(templateContext)).trim();
        return rendered.length > 0
            ? `${subsequent ? '\n' : ''}${rendered}\n`
            : '';
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUEsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sY0FBYyxDQUFBO0FBRWpEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLHNCQUFzQixDQUNwQyxPQUFxQyxFQUNyQyxPQUE2QjtJQUU3QixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFBO0lBRTVCLE9BQU8sS0FBSyxFQUNWLE9BQW9DLEVBQ3BDLFNBQXdCLEVBQ3hCLFVBQW9CLEVBQ3BCLEVBQUU7UUFDRixNQUFNLGVBQWUsR0FBRyxNQUFNLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ3RGLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUV6RCxPQUFPLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUN4QixDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLFFBQVEsSUFBSTtZQUMxQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBQ1IsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyJ9