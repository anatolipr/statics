import { bindModelToInputs } from "../../../rand/util.mjs";

customElements.define('avo-section-editor', class extends HTMLElement {
    
    #value;

    set value(value) {
        if (this.#value) {
            Object.assign(this.#value, value);
        } else {
            this.#value = value;
            bindModelToInputs(this, this.#value);
        }
    }

    get value() {
        return this.#value;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        this.innerHTML = `
        <avo-field-with-label label="ID">
        <input data-bind="id">
        </avo-field-with-label>
        `;
        bindModelToInputs(this, this.#value);
    }
});