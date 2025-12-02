export const emit = (target, eventName, detail) => {
    target.dispatchEvent(new CustomEvent(eventName, { detail }));
}

export class EventEmitter extends EventTarget {
    emit(eventName, detail) {
        emit(this, eventName, detail);
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
                //console.log(`${prop}Set`, value)
                // Dispatch event on the target (the EventTarget instance)
                target.emit(`${prop}Set`, value);
            }
            
            return success;
        }
    });
}

export class BaseModel extends EventEmitter {
    constructor() {
        super();
        return observe(this);
    }
}

export const defineElementsWithDataId = (component) => {
    (component.shadowRoot ? component.shadowRoot : component).querySelectorAll('[data-id]').forEach(el => {
        component[`${el.dataset.id}El`] = el;
    });
}

export function bindModelToInputs(component, model, map) {
    
    defineElementsWithDataId(component);

    if (!map) {
        map = {};
        
        (component.shadowRoot ? component.shadowRoot : component).querySelectorAll('[data-id]').forEach(el => {
            map[el.dataset.id] = el.dataset.id + 'El';
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
        
        if (model[prop] !== undefined) {
            el.value = model[prop];
        }

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