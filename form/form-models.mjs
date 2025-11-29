import { BaseModel } from "../rand/util.mjs";

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

export class CondtionModel extends BaseModel {
    fieldName;
    requiredValue;

    fromJson(json) {
        this.fieldName = json.requiredValue;
        this.requiredValue = json.requiredValue;
    }
}

export class FieldModel extends BaseModel {
    label;
    description;
    type;
    //single
    placeholder;
    fieldName;
    required = false;
    value; 
    validation;
    condition;

    //custom
    customElementName;

    section;
}

export class SectionModel extends BaseModel {
    id;
    title;
    description;
    multi = false; //section can be repeated
    key; //used when nested JSON is produced as the key for the nested value
    condition;
    fields = [];

    fromJson(json) {
        this.id = json.id;
        this.title = json.title;
        this.description = json.description;
        this.multi = json.multi;
        this.key = json.key;
        const condition = new CondtionModel();
        condition.fromJson(json.condition);
        this.condition = condition;
        this.fields = json.fields.map(field => {
          const fieldModel = new FieldModel();
          fieldModel.fromJson(field);
          return field;
        });
    }

}

export class ButtonModel extends BaseModel {
    label;
    value;
    type;
    condition;

    fromJson(json) {
        this.label = json.label;
        this.value = json.value;
        this.type = json.type;
        this.condition = json.condition;
    }
}

export class FormModel extends BaseModel {
    id;
    title;
    description;
    sections = [];
    buttons = [];
    css;

    fromJson(json) {
        this.id = json.id;
        this.title = json.title;
        this.description = json.description;
        this.sections = json.sections;
        this.buttons = json.buttons;
        this.css = json.css;
    }
}