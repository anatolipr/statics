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
            // 2. Use Reflect.set instead of target[prop] = value
            const success = Reflect.set(target, prop, value, receiver);
            
            if (success) {
                console.log(`${prop}Set`);
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
