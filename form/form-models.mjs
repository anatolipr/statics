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

    static fromJson(json) {
        const condition = new CondtionModel();
        if (!json) return condition;
        condition.fieldName = json.requiredValue;
        condition.requiredValue = json.requiredValue;
        return condition;
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

    static fromJson(json) {
      const fieldModel = new FieldModel();
      fieldModel.label = json.label;
      fieldModel.description = json.description;
      fieldModel.type = json.type;
      fieldModel.placeholder = json.placeholder;
      fieldModel.fieldName = json.fieldName;
      fieldModel.required = json.required;
      fieldModel.value = json.value;
      fieldModel.validation = json.validation;
      fieldModel.condition = CondtionModel.fromJson(json.condition);
      fieldModel.customElementName = json.customElementName;
      fieldModel.section = SectionModel.fromJson(json.section);
      return fieldModel;
    }
}

export class SectionModel extends BaseModel {
    id;
    title;
    description;
    multi = false; //section can be repeated
    key; //used when nested JSON is produced as the key for the nested value
    condition;
    fields = [];

    static fromJson(json) {
        if (!json) return;
        const section = new SectionModel(); 
        section.id = json.id;
        section.title = json.title;
        section.description = json.description;
        section.multi = json.multi;
        section.key = json.key;
        section.condition = CondtionModel.fromJson(json.condition);
        this.fields = json.fields?.map(field => {
          return FieldModel.fromJson(field);
        });
        return section;
    }

}

export class ButtonModel extends BaseModel {
    label;
    value;
    type;
    condition;

    static fromJson(json) {
        const buttonModel = new ButtonModel();
        buttonModel.label = json.label;
        buttonModel.value = json.value;
        buttonModel.type = json.type;
        buttonModel.condition = json.condition;
        return buttonModel;
    }
}


export class SectionsModel extends BaseModel {
    list = [];
    
    add() {
        const section = new SectionModel();
        this.list.push(section);
        this.emit('added', section);
    }

    remove(idx) {
      this.list.splice(idx, 1);
      this.emit('removed', idx);
    }

    static fromJson(json) {
        const model = new SectionsModel();
        model.list = json.map(value => SectionModel.fromJson(value));
        return model;
    }
    
}

export class FormModel extends BaseModel {
    id;
    title;
    description;
    sections = new SectionsModel();
    buttons = [];
    css;

    
    addButton(button) {
      this.buttons.push(button);
      this.emit('buttonAdded', button);
    }

    removeButton(idx) {
      this.buttons.splice(idx, 1);
      this.emit('buttonRemoved', idx);
    }

    static fromJson(json) {
        const formModel = new FormModel();
        formModel.id = json.id;
        formModel.title = json.title;
        formModel.description = json.description;
        formModel.sections = SectionsModel.fromJson(json.sections);
        formModel.buttons = json.buttons;
        formModel.css = json.css;
        return formModel;
    }
}