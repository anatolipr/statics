import { getInputValue, updateElementValue } from './puppet-dom-helper.mjs';
import { getByPath, setByPath, removeByPath, generateSetByPathCalls } from './model-util.mjs';

export class DomPuppet {
    el;
    model;
    derived;
    modifiers;
    subscribers;
    methods;

    constructor(options) {
        const { el,
            model,
            derived,
            modifiers,
            subscribers,
            methods
        } = options;

        this.el = el instanceof Element ? el : document.getElementById(el);
        this.el.__dom_puppet = this;
        this.model = model || {};
        this.derivery = new Derivery(derived || {}, model);
        this.modifiers = modifiers || {};
        this.subscribers = subscribers || {};
        this.methods = methods || {};

        this.handleList(this.el);
        this.triggerUpdates();
        this.registerEventHandlers()
    }

    triggerUpdates(eventKey, targetEl) {
        this.replaceValues(eventKey, targetEl || this.el);
        this.replaceStyles(eventKey, targetEl || this.el);
        this.replaceAttributes(eventKey, targetEl || this.el);
    }

    replaceValues(eventKey, targetEl) {

        if (eventKey) {
            targetEl.querySelectorAll(`[data-value='${eventKey}'],[data-value*='${eventKey}|']`)
                .forEach(el => updateElementValue(el, this.getValue(el.dataset.value)));
        } else {
            targetEl.querySelectorAll('[data-value]').forEach(el =>
                updateElementValue(el, this.getValue(el.dataset.value)));
        }

    }

    handleListItem(element) {

        const keypath = element.dataset.list;
        const templateEl = element.children[0].cloneNode(true);
        element.__dom_puppet_list_template = templateEl;

        element.innerHTML = '';

        (this.getValue(keypath) || []).forEach((item, index) => {
            this.handleNewListItem(element, keypath, templateEl, index);
        });

    }

    handleList(element) {

        let els = [];
        if (element.dataset.list) {
            els.push(element);
        }

        [...els, ...element.querySelectorAll('[data-list]')]
        .forEach(this.handleListItem.bind(this));

    }

    handleNewListItem(listEl, keypath, templateEl, index) {
        const clone = templateEl.cloneNode(true);
        clone.dataset.index = index;

        const prefix = `${keypath}.${index}`;

        const wholeMappings = ['value', 'update', 'list', 'target'];
        wholeMappings.forEach(mapping => {

            [...clone.querySelectorAll(`[data-${mapping}]`)]
            .filter(child => (
                child.dataset.list ||
                child.closest('[data-list]') === null
                ))
            .forEach(child => {
                if (child.dataset[mapping] === 'this') {
                    child.dataset[mapping] = prefix;
                } else {
                    child.dataset[mapping] = prefix + '.' + child.dataset[mapping];
                }
            });

            if (clone.dataset[mapping]) {
                if (clone.dataset[mapping] === 'this') {
                    clone.dataset[mapping] = prefix;
                } else {
                    clone.dataset[mapping] = prefix + '.' + clone.dataset[mapping];
                }
            }

        });

        //style and attributes

        function prefixTags(style, prefix) {
            if (!style) {
                return style;
            }

            [...style.matchAll(/(\{([\w.\|]*)\})/gsi)]
                .map(m => m[2])
                .forEach(tag => {
                    if (tag === 'this') {
                        style = style.replaceAll(`\{${tag}\}`, `{${prefix}}`);
                    } else {
                        style = style.replaceAll(`\{${tag}\}`, `{${prefix}.${tag}}`);
                    }
                });
            return style;
        }

        const tagMappings = ['style', 'attributes'];
        tagMappings.forEach(mapping => {

            [...clone.querySelectorAll(`[data-${mapping}]`)]
            .filter(child => child.closest('[data-list]') === null)
            .forEach(child => {
                child.dataset[mapping] = prefixTags(child.dataset[mapping], prefix);
            });

            clone.dataset[mapping] 
               && (clone.dataset[mapping] = prefixTags(clone.dataset[mapping], prefix));

        });

        const subList = clone.querySelector('[data-list]');

        if (subList || clone.dataset.list) {
            this.handleList(clone, prefix);
        }

        listEl.appendChild(clone);
        return clone;
    }

    replaceAttributes(eventKey, targetEl) {


        /**
         * 
         * @param {string} a eg. 'src: {myval}; alt: {myval-alt}'
         * @returns 
         */

        function getAttributeMapFromString(a) {
            return a.split(';').reduce((ac, v) => {
                if (!v.trim()) { return ac };
                let [attribute, rawValue] = v.split(':').map(v => v.trim());
                rawValue = rawValue.replaceAll(/{|}/g, '');
                let [value] = rawValue.split('|');


                if (!ac[value]) {
                    ac[value] = {
                        attrs: [],
                        rawValue
                    }
                }
                ac[value].attrs.push(attribute);

                return ac;
            }, {});
        }



        // data-attributes="src: {image};"

        const selector = eventKey ?
            `[data-attributes*="{${eventKey}}"],[data-attributes*="{${eventKey}|"]`
            : '[data-attributes]';

        targetEl.querySelectorAll(selector).forEach(el => {
            const valueMap = getAttributeMapFromString(el.dataset.attributes);

            if (eventKey) {
                const rawValue = valueMap[eventKey].rawValue;
                valueMap[eventKey].attrs.forEach(attribute => {
                    el.setAttribute(attribute, this.getValue(rawValue));
                });
            } else {
                Object.entries(valueMap).forEach(([keypath, meta]) => {
                    const value = this.getValue(meta.rawValue);
                    meta.attrs.forEach(attribute => el.setAttribute(attribute, value));
                })
            }
        });

        if (eventKey) {
            this.el.querySelectorAll(`[data-value='${eventKey}']`)
                .forEach(el => updateElementValue(el, this.getValue(eventKey)));
        } else {
            this.el.querySelectorAll('[data-value]').forEach(el =>
                updateElementValue(el, this.getValue(el.dataset.value)));
        }

    }

    refreshPaths(listEl) {

        const listKp = listEl.dataset.list;

        [...listEl.children].forEach(childEl => {
            const keypath = this.getListKeyPath(childEl);

            ['value', 'update', 'style',
                'attributes', 'list', 'target',
                'class'].forEach(dataAttr => {

                    childEl.querySelectorAll(`[data-${dataAttr}]`).forEach(el => {
                        const replacer = `^(${listKp}\\.\\d+)`;
                        const tokenReplacer = `\\{(${listKp}\\.\\d+)`;

                        el.dataset[dataAttr] = el.dataset[dataAttr]
                            ?.replaceAll(new RegExp(replacer, 'g'), keypath);
                        el.dataset[dataAttr] = el.dataset[dataAttr]
                            ?.replaceAll(new RegExp(tokenReplacer, 'g'), '{' + keypath);

                    });

                });

        });

    }

    removeListItem(what) {

        let keypath;
        if (what instanceof HTMLElement) {
            keypath = this.getListKeyPath(what);
        } else {
            keypath = what;
        }

        const list = keypath.substring(0, keypath.lastIndexOf('.'));
        const index = keypath.substring(keypath.lastIndexOf('.') + 1);

        const listEl = document.querySelector(`[data-list='${list}']`);

        [...listEl.children][index].remove();
        removeByPath(this.model, keypath);

        this.refreshPaths(listEl);
    }

    addListItem(listKeyPath, value) {
        const listEl = document.querySelector(`[data-list="${listKeyPath}"]`);

        const index = this.getValue(listKeyPath).length;

        this.setValue(listKeyPath + '.' + index, value);

        const templateEl = listEl.__dom_puppet_list_template;

        const newEl = this.handleNewListItem(listEl, listKeyPath, templateEl, index);

        //puppet
        this.triggerUpdates(undefined, newEl);
        this.registerElementEvents(newEl);

    }

    //internal
    replaceList(listKeyPath, newList) {
        const listEl = document.querySelector(`[data-list="${listKeyPath}"]`);

        if (!listEl) {
            return;
        }
        
        const templateEl = listEl.__dom_puppet_list_template;
        
        listEl.innerHTML = '';

        newList.forEach((item, idx) => {

            const newEl = this.handleNewListItem(listEl, listKeyPath, templateEl, idx);
            //puppet
            this.triggerUpdates(undefined, newEl);
            this.registerElementEvents(newEl);

        })
        
    }

    //returns keypath of an element within a list ([data-list])
    getListKeyPath(el) {
        const listEl = el.closest('[data-list]');
        const listChildren = [...listEl.children];
        const rowEl = listChildren.find(child => child.contains(el));
        const index = listChildren.indexOf(rowEl);
        return `${listEl.dataset.list}.${index}`;
    }

    /**
     * 
     * @param {Object} model 
     * @param {(path: string) => any} getByPath
     * @param {string} eventKey 
     */

    replaceStyles(eventKey, targetEl) {

        const selector = eventKey ?
            `[data-style*="{${eventKey}}"],[data-style*="{${eventKey}|"]` : '[data-style]';

        targetEl.querySelectorAll(selector).forEach(el => {

            let style = el.dataset.style;

            if (!el.__original_style__) {
                el.__original_style__ = el.style.cssText;
            }

            [...style.matchAll(/(\{([\w.\|]*)\})/gsi)]
                .map(m => m[2])
                .forEach(tag => {
                    const value = this.getValue(tag);
                    style = style.replaceAll(`\{${tag}\}`, value);
                });
            el.style.cssText = `${el.__original_style__} ${style}`;
        });

    }

    getValue(keypath) {

        if (this.derivery.hasDeriver(keypath)) {
            return this.derivery.derive(keypath);
        } 
        
        
        const [key, ...modifiers] = keypath.split('|');

        let value;
        if (key.endsWith('.index')) {
            const parts = key.split('.');
            value = parts[parts.length - 2];
        } else {
            value = getByPath(this.model, key);
        }

        modifiers.forEach(modifierKey => {
            if (!this.modifiers[modifierKey]) {
                console.warn(`Modifier [${modifierKey}] not found for value [${keypath}]`)
            } else {
                value = this.modifiers[modifierKey].bind(this)(value);
            }
        })

        return value;
    }

    setValue(keypath, nv) {
        if (this.derivery.hasDeriver(keypath)) {
            console.warn(`cannot update a derived value ${keypath}`)
            return;
        }

        const ov = getByPath(this.model, keypath);

        setByPath(this.model, keypath, nv);
        this.notifyForUpdate(keypath, ov, nv);

        if (Array.isArray(nv)) {
            this.replaceList(keypath, nv);
        }
    }

    setValues(json, basePath = '') {
        const values = generateSetByPathCalls(json, basePath);
        values.forEach(value => {
            this.setValue(value.path, value.value);
        });
    }

    registerEventHandlers() {

        //
        this.el.addEventListener('update', (e) => {

            if (typeof this.subscribers[e.detail.k] === 'function') {
                Promise.resolve().then(
                    () => {
                        this.subscribers[e.detail.k].bind(this)(e.detail.nv, e.detail.ov, e.detail.k);
                    }
                );

            }

            this.triggerUpdates(e.detail.k);

            if (this.derivery.hasDependent(e.detail.k)) {
                this.derivery.keyFn[e.detail.k].forEach(fn => {
                    this.notifyForUpdate(fn);
                });
            }

            e.stopPropagation();
        });

        this.registerElementEvents(this.el);

    }

    registerElementEvents(targetEl) {

        [...targetEl.parentElement.querySelectorAll('[data-update]')]
        .filter(element => !element.__dom_puppet_data_update_registered)
        .forEach(element => {
                element.addEventListener('input', e => {
                    const k = e.target.dataset.update;
                    const nv = getInputValue(e);
                    this.setValue(k, nv);
                });
                element.__dom_puppet_data_update_registered = true;
        });

        [...targetEl.parentElement.querySelectorAll('[data-on]')]
            .filter(element => !element.__dom_puppet_data_on_registered)
            .forEach(element => {
                const [event, method] = element.dataset.on.split(':');
                element.addEventListener(event, (e) => {
                    this.methods[method].bind(this)(e);
                });
                element.__dom_puppet_data_on_registered = true;
            });
    }

    notifyForUpdate(k, ov, nv) {
        requestAnimationFrame(

            () => {
                this.el.dispatchEvent(new CustomEvent('update', {
                    detail: {
                        k, ov, nv
                    }
                }));
            }

        )

    }

}

class Derivery {

    // foo.bar : visible()
    keyFn = {};


    constructor(derived, model) {

        this.derived = derived;
        this.model = model;

        this.getByPath = (keypath) => {
            return getByPath(this.model, keypath)
        };

        this.getValue = this.getInit;
        Object.keys(derived).forEach(
            (fn) => {
                this.fn = fn;
                derived[fn].bind(this).apply();
                this.fn = undefined;
            }
        )

        this.getValue = this.getByPath

    }

    derive(fn) {
        return this.derived[fn].bind(this)();
    }

    hasDependent(keypath) {
        return this.keyFn[keypath] !== undefined;
    }

    hasDeriver(value) {
        return Object.keys(this.derived).indexOf(value) > -1;
    }

    getInit(keypath) {

        if (this.keyFn[keypath] === undefined) {
            this.keyFn[keypath] = [];
        }

        if (this.keyFn[keypath].indexOf(this.fn) === -1) {
            this.keyFn[keypath].push(this.fn);
        }

    }

}
