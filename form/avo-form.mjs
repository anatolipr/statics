import { bindModelToInputs, defineElementsWithDataId } from "../rand/util.mjs";
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
            <input data-id="requiredValue">
        `;

        defineElementsWithDataId(this);
        bindModelToInputs(this, this.model, {
            fieldName: "fieldNameEl",
            requiredValue: "requiredValueEl"
        });
        
    }
})