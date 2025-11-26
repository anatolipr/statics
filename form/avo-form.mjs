import { defineElementsWithDataId } from "../rand/util.mjs";
import { CondtionModel } from "./form-models.mjs";

customElements.define('avo-form-test', class extends HTMLElement {
    constructor() {
        super();
    }

    model = new CondtionModel();

    connectedCallback() {
        this.innerHTML = `
            fieldName
            <input data-id="fieldName"><br>
            expectedValue
            <input data-id="expectedValue">
        `;

        defineElementsWithDataId(this);

        this.model.addEventListener('fieldNameSet', (e) => {
            this.fieldNameEl.value = e.detail;
        });

        this.model.addEventListener('expectedValueSet', (e) => {
            this.expectedValueEl.value = e.detail;
        });

        this.fieldNameEl.addEventListener('input', e => this.model.fieldName = e.target.value);
        this.expectedValueEl.addEventListener('input', e => this.model.expectedValue = e.target.value);
        
    }
})