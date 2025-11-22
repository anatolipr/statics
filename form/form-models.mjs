import { EventEmitter } from "../rand/util.mjs";

export const ButtonType = Object.freeze({
    SUBMIT: 'SUBMIT',
    CANCEL: 'CANCEL'
});

export const FieldType = Object.freeze({
    text: 'text',
    number: 'number',
    textarea: 'textarea',
    date: 'date',
    radios: 'radios',
    checkboxes: 'checkboxes',
    dropdown: 'dropdown',
    title: 'title', //?

    CUSTOM_ELEMENT: 'CUSTOM_ELEMENT',
    SECTION: 'SECTION'
});

export const TYPE_OPTIONS = [
    {
        label: 'Text',
        value: FieldType.text
    },
    {
        label: 'Number',
        value: FieldType.number
    },
    {
        label: 'Textarea',
        value: FieldType.textarea
    },
    {
        label: 'Radio',
        value: FieldType.radios
    },
    {
        label: 'Checkboxes',
        value: FieldType.checkboxes
    },
    {
        label: 'Date',
        value: FieldType.date
    },
    {
        label: 'Dropdown',
        value: FieldType.dropdown
    },
    {
        label: 'Title',
        value: FieldType.title
    },
    {
        label: 'Custom',
        value: FieldType.CUSTOM_ELEMENT
    },
    {
        label: 'Section',
        value: FieldType.SECTION
    },
];

export class CondtionModel extends EventEmitter {
    #fieldName;
    #requiredValue;

    get () {
      return this.#fieldName;
    }
    
    set fieldName(fieldName) {
      this.#fieldName = fieldName;
      this.emit('fieldNameSet', fieldName);
    }

    get () {
      return this.#requiredValue;
    }
    
    set requiredValue(requiredValue) {
      this.#requiredValue = requiredValue;
      this.emit('requiredValueSet', requiredValue);
    }

    toJson() {
        return {
            fieldName: this.fieldName,
            requiredValue: this.requiredValue
        }
    }

    static fromJson(json) {
        const condition = new CondtionModel();
        condition.fieldName - json.requiredValue;
        condition.requiredValue = json.requiredValue;
        return condition;
    }
}

export class FieldModel extends EventEmitter {
    #label;
    #description;
    #type;
    //single
    #placeholder;
    #fieldName;
    #required = false;
    #value; 
    #validation;
    #condition;

    //custom
    #customElementName;

    //section
    #sectionModel;
}



export class SectionModel extends EventEmitter {
    #id;
    #title;
    #description;
    #multi = false; //section can be repeated
    #key; //used when nested JSON is produced as the key for the nested value
    #condition;
    #fields = [];

    get () {
      return this.#id;
    }
    
    set id(id) {
      this.#id = id;
      this.emit('idSet', id);
    }

    get () {
      return this.#title;
    }
    
    set title(title) {
      this.#title = title;
      this.emit('titleSet', title);
    }

    get () {
      return this.#description;
    }
    
    set description(description) {
      this.#description = description;
      this.emit('descriptionSet', description);
    }

    get () {
      return this.#multi;
    }
    
    set multi(multi) {
      this.#multi = multi;
      this.emit('multiSet', multi);
    }

    get () {
      return this.#key;
    }
    
    set key(key) {
      this.#key = key;
      this.emit('keySet', key);
    }

    get () {
      return this.#condition;
    }
    
    set condition(condition) {
      this.#condition = condition;
      this.emit('conditionSet', condition);
    }

    get () {
      return this.#fields;
    }
    
    set fields(fields) {
      this.#fields = fields;
      this.emit('fieldsSet', fields);
    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            multi: this.multi,
            key: this.key,
            condition: this.condition.toJson(),
            fields: this.fields.map(field => field.toJson())
        }
    }

    fromJson(json) {
        this.id = json.id;
        this.title = json.title;
        this.description = json.description;
        this.multi = json.multi;
        this.key = json.key;
        this.condition = 
    }

}

export class ButtonModel extends EventEmitter {
    #label;
    #value;
    #type;
    #condition;

    get () {
      return this.#label;
    }
    
    set label(label) {
      this.#label = label;
      this.emit('labelSet', label);
    }

    get () {
      return this.#value;
    }
    
    set value(value) {
      this.#value = value;
      this.emit('valueSet', value);
    }

    get () {
      return this.#type;
    }
    
    set type(type) {
      this.#type = type;
      this.emit('typeSet', type);
    }

    get () {
      return this.#condition;
    }
    
    set condition(condition) {
      this.#condition = condition;
      this.emit('conditionSet', condition);
    }

    toJson() {
        return {
            label: this.label,
            value: this.value,
            type: this.type,
            condition: this.condition
        }
    }

    fromJson(json) {
        this.label = json.label;
        this.value = json.value;
        this.type = json.type;
        this.condition = json.condition;
    }
}

export class FormModel extends EventEmitter {
    #id;
    #title;
    #description;
    #sections = [];
    #buttons = [];
    #css;

    get id() {
        return this.#id;
    }

    set id(id) {
        this.#id = id;
        this.emit('idSet', title)
    }

    get title() {
        return this.#title;
    }

    set title(title) {
        this.#title = title;
        this.emit('titleSet', title);
    }
    
    get () {
      return this.#description;
    }
    
    set description(description) {
      this.#description = description;
      this.emit('descriptionSet', description);
    }

    get () {
      return this.#sections;
    }
    
    set sections(sections) {
      this.#sections = sections;
      this.emit('sectionsSet', sections);
    }

    get () {
      return this.#buttons;
    }
    
    set buttons(buttons) {
      this.#buttons = buttons;
      this.emit('buttonsSet', buttons);
    }

    get () {
      return this.#css;
    }
    
    set css(css) {
      this.#css = css;
      this.emit('cssSet', css);
    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            sections: this.sections.toJson(),
            buttons: this.buttons.toJson(),
            css: this.css
        }
    }

    fromJson(json) {
        this.id = json.id;
        this.title = json.title;
        this.description = json.description;
        this.sections = json.sections;
        this.buttons = json.buttons;
        this.css = json.css;
    }
}

