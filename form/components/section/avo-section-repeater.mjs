import { emit } from "../../../rand/util.mjs";

customElements.define('avo-section-repeater', class extends HTMLElement {
    constructor() {
        super();
    }

    #model;
    #emptyModel;

    set model(model) {
        if (this.#model) {
            this.#model = [... model];
        } else {
            this.#model = model;
        }
        this.render();
    }

    get model() {
        return this.#model;
    }

    set emptyModel(emptyModel) {
        this.#emptyModel = emptyModel;
    }

    get emptyModel() {
        return this.#emptyModel;
    }

    connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        this.repeatedChild = this.firstChild().cloneNode(true);
        
        this.render();
    }

    render() {
        if (!this._initialized) return;
        if (!this.repeatedChild) return;

        this.replaceChildren(
            ... this.#model.map(value => {
                const child = this.repeatedChild.cloneNode(true);
                child.model = value;
            })
        );

    }

    removeChild(idx) {
        this.#model.splice(idx, 1);
        emit(this, 'input', this.#model);
    }

    addChild(idx) {
        const newValue = structuredClone(this.#emptyModel);
        const child = this.repeatedChild.cloneNode(true);
        //add to bottom
        if (idx === undefined) {
            this.#model.push(newValue);
            insertAt(child);
        } else {
            this.insertValueAtIndex(idx, newValue);
            this.insertAt(child, idx);
        }
        emit(this, 'input', this.#model);
    }

    //DOM
    insertAt(child, index) {
        const referenceNode = index !== undefined ? this.children[index] : null;
        this.insertBefore(child, referenceNode || null);
        
    }

    insertValueAtIndex(index, value) {
        this.#model.splice(index, 0, value);
        emit(this, 'input', this.#model);
    }

    moveElementUp(element) {
        const parent = element.parentNode;
        if (!parent) {
            console.warn("Element has no parent.");
            return;
        }

        const previousSibling = element.previousElementSibling;
        if (previousSibling) {
            parent.insertBefore(element, previousSibling);
        } else {
            console.log("Element is already the first child.");
        }
    }

    moveElementDown(element) {
        if (!element || !element.parentNode) {
            console.warn("Element or its parent not found.");
            return;
        }

        const parent = element.parentNode;
        const nextSibling = element.nextElementSibling;

        if (nextSibling) {
            parent.insertBefore(nextSibling, element); // Inserts nextSibling *before* element, effectively moving element down
        } else {
            console.log("Element is already the last child, cannot move down further within this parent.");
        }
    }

});