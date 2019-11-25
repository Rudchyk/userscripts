
import { container, label, input } from './create';
import { selectAllAction } from './helpers';

const generalFieldsClasses = 'tmp-field-group js-tpm-field-group';
const generalLabelClasses = 'tmp-label';

export function appendTextInput(parentElement, value, id, title, isNoSelect, divClassName, inputClassName = 'tuiTextField') {
    const divClasses = divClassName ? `${generalFieldsClasses} ${divClassName}` : generalFieldsClasses;
    const div = container(
        'div',
        divClasses
    );

    if(title) {
        const labelEl = label(
            title,
            id,
            generalLabelClasses
        );
        div.appendChild(labelEl);
    }

    const inputEl = input(
        value,
        id,
        inputClassName
    );

    if(!isNoSelect) {
        inputEl.addEventListener('click', selectAllAction);
    }

    div.appendChild(inputEl);

    parentElement.appendChild(div);
};