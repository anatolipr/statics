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

export class FieldModel {
    #label;
    #description;
    #type;
    //single
    #placeholder;
    #fieldName;
    #required = false;
    #value; 
    #validation;

    //custom
    #customElementName;

    //section
    #sectionModel;
}

export class SectionModel {
    #id;
    #title;
    #description;
    #multi = false; //section can be repeated
    #key; //used when nested JSON is produced as the key for the nested value
    #fields = [];
}

export class ButtonModel {
    #label;
    #value;
    #type;
}

export class FormModel {
    #id;
    #title;
    #description;
    #sections;
    #buttons;
}

