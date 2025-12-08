import './other/avo-pair-input.mjs'
import './other/avo-field-with-label.mjs'
import './other/avo-field-list.mjs'
import './section/avo-sections-list.mjs'

import { FormModel, SectionModel, SectionsModel } from "../form-models.mjs";
import { bindModelToInputs } from '../../rand/util.mjs';

const css = await fetch(import.meta.resolve('./avo-form-editor.css'))
.then(r => r.text());

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(css);

customElements.define('avo-form-editor', class extends HTMLElement {
    
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
        this.attachShadow({'mode': 'open'});
    }

    connectedCallback() {

        if (this._initialized) return;
        this._initialized = true;

        this.shadowRoot.innerHTML = `
            
            <avo-field-list>

                <avo-field-with-label label="ID">
                    <input type="text" data-bind="id">
                </avo-field-with-label>
                <avo-field-with-label label="Title">
                    <input type="text" data-bind="title">
                </avo-field-with-label>
                <avo-field-with-label label="Description">
                    <input type="text" data-bind="description">
                </avo-field-with-label>

                <avo-field-with-label label="Sections">
                    <avo-sections-list data-bind="sections"></avo-sections-list>
                </avo-field-with-label>

                <avo-field-with-label label="CSS">
                    <textarea data-bind="css"></textarea>
                </avo-field-with-label>

            </avo-field-list>
            
        `;

        this.shadowRoot.adoptedStyleSheets = [ stylesheet ];


        const existing = new FormModel();
        existing.id = "123";
        existing.sections = SectionsModel.fromJson([
            {
                id: '123', title: 'foo'
            },
            {
                id: '321', title: 'abc'
            },
            {
                id: '111', title: 'bar'
            },
        ]);

        

        this.value = existing;
        //this.shadowRoot.querySelector('[data-bind="sections"]').value = existing.sections;
        this.shadowRoot.querySelector('[data-bind="sections"]').emptyModelFn = function () {
            return SectionModel.fromJson({
                id: 'xxx', title: 'xxx'
            })
        }

        this.shadowRoot.addEventListener('inputHandled', e => console.log)

    }

});