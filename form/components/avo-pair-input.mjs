import { bindModelToInputs, defineElementsWithDataId, split } from "../../rand/util.mjs";

customElements.define('avo-pair-input', class extends HTMLElement {
    constructor() {
        super();
        this.placeholders = split(this.getAttribute('placeholders'));
        this.fields = split(this.getAttribute('fields'))
    }

    #model;

    set model(model) {
        if (this.#model) {
            Object.assign(this.#model, model);
        } else {
            this.#model = model;
            const mapping = {};
            mapping[this.fields[0]] = 'keyEl';
            mapping[this.fields[1]] = 'valueEl';
            bindModelToInputs(this, this.#model, mapping);
        }
    }

    get model() {
        return this.#model;
    }

    connectedCallback() {
        this.innerHTML = `
        <div style="position: relative" class="font-family options-fields">
            <input
                class="first-field"
                type="text"
                data-id="key"
                placeholder="${this.placeholders[0] || ''}" />
            <input
                class="second-field"
                type="text"
                data-id="value"
                placeholder="${this.placeholders[1] || ''}" />
        </div>
        `;
        
    }
})