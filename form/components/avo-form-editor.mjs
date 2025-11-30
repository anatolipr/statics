import './other/avo-pair-input.mjs'
import './other/avo-field-with-label.mjs'
import './other/avo-field-list.mjs'

import { CondtionModel, FormModel } from "../form-models.mjs";
import { bindModelToInputs } from '../../rand/util.mjs';

const css = await fetch(import.meta.resolve('./avo-form-editor.css'))
.then(r => r.text());

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(css);

customElements.define('avo-form-editor', class extends HTMLElement {
    
    #model;

    set model(model) {
        if (this.#model) {
            Object.assign(this.#model, model);
        } else {
            this.#model = model;
            bindModelToInputs(this, this.#model);
        }
    }

    get model() {
        return this.#model;
    }

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
                    <input type="text" data-id="id">
                </avo-field-with-label>
                <avo-field-with-label label="Title">
                    <input type="text" data-id="title">
                </avo-field-with-label>
                <avo-field-with-label label="Description">
                    <input type="text" data-id="description">
                </avo-field-with-label>

                <avo-field-with-label label="Sections">
                    TODO
                </avo-field-with-label>

                <avo-field-with-label label="CSS">
                    <textarea data-id="css"></textarea>
                </avo-field-with-label>

            </avo-field-list>
            
        `;

        this.shadowRoot.adoptedStyleSheets = [ stylesheet ];




        this.model = new FormModel();
    }

});