var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
import path from 'path';
/**
 * Trying to add 'conventional-changelog-' prefix to preset name if it is a shorthand.
 * @param preset - Absolute path, package name or shorthand preset name.
 * @returns Variants of preset names.
 */
function resolvePresetNameVariants(preset) {
    if (path.isAbsolute(preset)) {
        return [preset];
    }
    let scope = '';
    let name = preset.toLocaleLowerCase();
    if (preset.startsWith('@')) {
        const parts = preset.split('/');
        scope = `${parts.shift()}/`;
        if (scope === '@conventional-changelog/') {
            return [preset];
        }
        name = parts.join('/');
    }
    if (!name.startsWith('conventional-changelog-')) {
        name = `conventional-changelog-${name}`;
    }
    const altPreset = `${scope}${name}`;
    if (altPreset !== preset) {
        return [altPreset, preset];
    }
    return [preset];
}
/**
 * Gets default export from CommonJS or ES module.
 * @param module
 * @returns Default export.
 */
function getModuleDefaultExport(module) {
    if (('__esModule' in module || Object.getPrototypeOf(module) === null) && 'default' in module) {
        return module.default;
    }
    return module;
}
/**
 * Loads module with fallbacks.
 * @param moduleLoader - Function that loads module.
 * @param variants - Variants of module name to try.
 * @returns Loaded module.
 */
async function loadWithFallbacks(moduleLoader, variants) {
    let error = null;
    for (const variant of variants) {
        try {
            return getModuleDefaultExport(await moduleLoader(variant));
        }
        catch (err) {
            error ||= err;
        }
    }
    throw error;
}
/**
 * Creates preset loader.
 * @param moduleLoader - Function that loads module.
 * @returns Function that loads preset.
 */
export function createPresetLoader(moduleLoader) {
    return async function loadPreset(presetOrParams) {
        let preset;
        let params = null;
        if (typeof presetOrParams === 'string') {
            preset = presetOrParams;
        }
        else if (typeof presetOrParams === 'object' && typeof presetOrParams.name === 'string') {
            preset = presetOrParams.name;
            params = presetOrParams;
        }
        else {
            throw Error('Preset must be string or object with property `name`');
        }
        const presetNameVariants = resolvePresetNameVariants(preset);
        let createPreset;
        try {
            createPreset = await loadWithFallbacks(moduleLoader, presetNameVariants);
        }
        catch (err) {
            throw new Error(`Unable to load the "${preset}" preset. Please make sure it's installed.`, {
                cause: err
            });
        }
        if (typeof createPreset !== 'function') {
            throw new Error(`The "${preset}" preset does not export a function. Maybe you are using an old version of the preset. Please upgrade.`);
        }
        return params
            ? await createPreset(params)
            : await createPreset();
    };
}
/**
 * Load and create preset.
 */
export const loadPreset = createPresetLoader(preset => import(__rewriteRelativeImportExtension(preset)));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlc2V0TG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3ByZXNldExvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQTtBQVd2Qjs7OztHQUlHO0FBQ0gsU0FBUyx5QkFBeUIsQ0FBQyxNQUFjO0lBQy9DLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNqQixDQUFDO0lBRUQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFBO0lBQ2QsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQUE7SUFFckMsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDM0IsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUUvQixLQUFLLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQTtRQUUzQixJQUFJLEtBQUssS0FBSywwQkFBMEIsRUFBRSxDQUFDO1lBQ3pDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNqQixDQUFDO1FBRUQsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDeEIsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHlCQUF5QixDQUFDLEVBQUUsQ0FBQztRQUNoRCxJQUFJLEdBQUcsMEJBQTBCLElBQUksRUFBRSxDQUFBO0lBQ3pDLENBQUM7SUFFRCxNQUFNLFNBQVMsR0FBRyxHQUFHLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQTtJQUVuQyxJQUFJLFNBQVMsS0FBSyxNQUFNLEVBQUUsQ0FBQztRQUN6QixPQUFPLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQzVC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