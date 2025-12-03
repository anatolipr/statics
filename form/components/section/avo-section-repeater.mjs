import { emit } from "../../../rand/util.mjs";

customElements.define('avo-section-repeater', class extends HTMLElement {
    constructor() {
        super();
    }

    #value;
    #emptyModelFn;

    set value(value) {
        if (this.#value) {
            this.#value = [... value];
        } else {
            this.#value = value;
        }
        this.render();
    }

    get value() {
        return this.#value;
    }

    set emptyModelFn(emptyModelFn) {
        this.#emptyModelFn = emptyModelFn;
    }

    get emptyModelFn() {
        return this.#emptyModelFn;
    }

    connectedCallback() {
        if (this._initialized) return;
        
        this.repeatedChild = this.firstElementChild.cloneNode(true);
        
        
        this.innerHTML = `
        <div class="repeater"></div>
        <button class="add">add</button>
        `;

        this.repeater = this.querySelector('.repeater');
        this.addButton = this.querySelector('.add');
        this.addButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.addChild();
        })

        this.render();

        this._initialized = true;
    }

    render() {
        if (!this._initialized) return;
        if (!this.repeatedChild) return;
        
        this.repeater.replaceChildren(
            ... (this.#value || []).map(value => {
                const child = this.repeatedChild.cloneNode(true);
                child.value = value;
                return child;
            })
        );
        
    }

    removeChild(idx) {
        this.#value.splice(idx, 1);
        emit(this, 'input', this.#value);
    }

    addChild(idx) {
        const newValue = this.#emptyModelFn(this);
        const child = this.repeatedChild.cloneNode(true);
        child.value = newValue;
        //add to bottom
        if (idx === undefined) {
            this.#value.push(newValue);
            this.insertAt(child);
        } else {
            this.insertValueAtIndex(idx, newValue);
            this.insertAt(child, idx);
        }
        
        emit(this, 'input', this.#value);
    }

    //DOM
    insertAt(child, index) {
        const referenceNode = index !== undefined ? this.repeater.children[index] : null;
        this.repeater.insertBefore(child, referenceNode || null);
    }

    insertValueAtIndex(index, value) {
        this.#value.splice(index, 0, value);
        emit(this, 'input', this.#value);
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