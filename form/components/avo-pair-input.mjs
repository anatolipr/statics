import { bindModelToInputs, defineElementsWithDataId } from "../../rand/util.mjs";

customElements.define('avo-pair-input', class extends HTMLElement {
    constructor() {
        super();
        this.placeholders = (this.getAttribute('placeholders') || '')
        .split(',')
        .map(ph => ph.trim());

        this.fields = (this.getAttribute('fields') || '')
        .split(',')
        .map(ph => ph.trim());
    }

    #model;

    set model(model) {
        this.#model = model;
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

        defineElementsWithDataId(this);
        const mapping = {};
        mapping[this.fields[0]] = 'keyEl';
        mapping[this.fields[1]] = 'valueEl';
        queueMicrotask(() => {
            bindModelToInputs(this, this.#model, mapping);
        })
        
    }
})