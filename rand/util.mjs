export class EventEmitter extends EventTarget {
    emit(eventName, detail) {
        this.dispatchEvent(new CustomEvent(eventName, { detail }))
    }
}

function observe(obj) {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);
            // Binds methods (like addEventListener) to the original target
            if (typeof value === 'function') {
                return value.bind(target);
            }
            return value;
        },
        // 1. Add 'receiver' as the 4th argument
        set(target, prop, value, receiver) {

            if (target[prop] === value) {
                // If the values are identical, do nothing (don't set, don't emit)
                // and return true to indicate the "set" operation was successful
                return true;
            }

            // 2. Use Reflect.set instead of target[prop] = value
            const success = Reflect.set(target, prop, value, receiver);
            
            if (success) {
                // Dispatch event on the target (the EventTarget instance)
                target.dispatchEvent(new CustomEvent(`${prop}Set`, {
                    detail: value
                }));
            }
            
            return success;
        }
    });
}

export class BaseModel extends EventTarget {
    constructor() {
        super();
        return observe(this);
    }
}

export const defineElementsWithDataId = (container) => {
    container.querySelectorAll('[data-id]').forEach(el => {
        container[`${el.dataset.id}El`] = el;
    });
}

export function bindModelToInputs(component, model, map) {
    
    defineElementsWithDataId(component);

    if (!map) {
        map = {};
        container.querySelectorAll('[data-id]').forEach(el => {
            map[el.dataset.id] = el.dataset.id;
        });
    }

    for (const [prop, elName] of Object.entries(map)) {
        const el = component[elName];
        if (!el) continue;

        // 1. Model → View
        model.addEventListener(`${prop}Set`, e => {
            el.value = e.detail;

            component.dispatchEvent(new CustomEvent('input', {
                detail: {
                    prop,
                    target: el,
                    value: e.detail
                },
                bubbles: true
            }));
        });

        // 2. View → Model
        el.addEventListener('input', e => {
            model[prop] = e.target.value;
            e.stopPropagation();
        });
    }
}

export function split(str = '', trim = true) {
    return (str || '')
        .split(',')
        .map(ph => trim ? ph.trim() : ph);
}