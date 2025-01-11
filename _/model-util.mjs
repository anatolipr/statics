// @ts-check

/**
 * get JSON value by key path - 'active.people.4.first_name'
 * @param {Object} obj 
 * @param {string} path 
 * @returns 
 */
export function getByPath(obj, path) {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

/**
 * set JSON value by key path - 'active.people.4.active', true
 * @param {Object} obj 
 * @param {string} path 
 * @param {any} value 
 */
export function setByPath(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((acc, key) => acc[key] = acc[key] || {}, obj);
    // @ts-ignore
    target[lastKey] = value;
}

/**
 * 
 * @param {Object} obj 
 * @param {string} path 
 */
export function removeByPath(obj, path) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((acc, key) => acc && acc[key], obj);

    if (Array.isArray(target) && lastKey) {
        const index = parseInt(lastKey, 10);
        if (!isNaN(index) && index >= 0 && index < target.length) {
            target.splice(index, 1); // Removes the element cleanly from the array
        }
    } else if (target && lastKey && lastKey in target) {
        delete target[lastKey]; // Removes the property from the object
    }
}

/**
 * 
 * @param {*} updates 
 * @param {*} basePath 
 * @returns 
 */

export function generateSetByPathCalls(updates, basePath = '') {
    const calls = [];

    /**
     * @param {Object} obj 
     * @param {string} path 
     */
    function traverse(obj, path) {
        for (const key in obj) {
            // @ts-ignore
            if (Object.hasOwn(obj, key)) {
                const currentPath = path ? `${path}.${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    // Recursively traverse nested objects
                    traverse(obj[key], currentPath);
                } else {
                    // Push the path and value as a pair
                    calls.push({ path: currentPath, value: obj[key] });
                }
            }
        }
    }

    traverse(updates, basePath);
    return calls;
}

/**
 * 
 * @param {string} template 
 * @param {Object} obj
 * @returns 
 */
export function dynamicFunction(template, obj) {
    return Function(...Object.keys(obj), `return ${template};`)(...Object.values(obj));
}