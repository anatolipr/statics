import './avo-pair-input.mjs'
import './avo-field-with-label.mjs'
import './avo-field-list.mjs'

import { CondtionModel } from "../form-models.mjs";

const css = await fetch(import.meta.resolve('./avo-form-editor.css'))
.then(r => r.text());

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(css);

customElements.define('avo-form-editor', class extends HTMLElement {
    constructor() { 
        super();
        this.attachShadow({'mode': 'open'});
    }

    connectedCallback() {

        if (this._initialized) return;
        this._initialized = true;

        this.shadowRoot.innerHTML = `
            
            <avo-field-list>

                <avo-field-with-label label="ID">
                    <input type="text">
                </avo-field-with-label>
                <avo-field-with-label label="Name">
                    <input type="text">
                </avo-field-with-label>

                
                <avo-field-with-label label="Condition (temp)">
                    <avo-pair-input
                    fields="fieldName, requiredValue"
                    placeholders="field name, required value"
                    ></avo-pair-input>
                </avo-field-with-label>

            </avo-field-list>

            
            
        `;

        this.shadowRoot.adoptedStyleSheets = [ stylesheet ];

        const pairInput = this.shadowRoot.querySelector('avo-pair-input');
        pairInput.model = new CondtionModel(); 
    }

});