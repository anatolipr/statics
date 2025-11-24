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
        set(target, prop, value) {
            target[prop] = value;
            
            console.log(`${prop}Set`)
            target.dispatchEvent(new CustomEvent(`${prop}Set`, {
                detail: value
            }));
            
            return true;
        }
    });
}

export class BaseModel extends EventTarget {
    constructor() {
        super();
        return observe(this);
    }
} 
