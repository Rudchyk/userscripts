// ==UserScript==
// @name        JIRA issue helpers for TMW 2
// @namespace   https://jira.tailoredbrands.com/
// @include     https://jira.tailoredbrands.com/*
// @version     1
// @grant       none
// ==/UserScript==

const ge = ctx => document.querySelector(ctx);
const getParentNode = ctx => ge(ctx).parentNode;
const addCss = css => {
    nfxpnk.css += css;
};
const create = (tag, options, action) => {
    const element = document.createElement(tag);
    switch (tag) {
        case 'style':
            const head = document.head || document.getElementsByTagName('head')[0];
            element.type = 'text/css';
            if (element.styleSheet) {
                element.styleSheet.cssText = options;
            } else {
                element.appendChild(document.createTextNode(options));
            }
            head.appendChild(element);
            break;
        default:
            for (const key in options) {
                if (options.hasOwnProperty(key)) {
                    if(key === 'style') {
                        for (const styleProp in options[key]) {
                            if (options[key].hasOwnProperty(styleProp)) {
                                element.style[styleProp] = options[key][styleProp];
                            }
                        }
                    } else {
                        element[key] = options[key];
                    }
                }
            }
            if(action) {
                if (Array.isArray(action)) {
                    action.forEach(item => {
                        if(!item) { return }
                        element.addEventListener(item.type, item.listener, false);
                    });
                } else {
                    if(!action) { return }
                    element.addEventListener(action.type, action.listener, false);
                }
            }
            return element;
    }
};
const helpers = {
    selectAllAction(e) {
        e.target.select();
    },
    kebabCase(string) {
        return string
            .replace(/([a-z][A-Z])/g, function(match) {
                return match.substr(0, 1) + '-' + match.substr(1, 1).toLowerCase();
            })
            .toLowerCase()
            .replace(/[^-a-z0-9]+/g, '-')
            .replace(/^-+/, '').replace(/-$/, '');
    },
    changeStr(string) {
        return string
            .replace(/\[/g, '')
            .replace(/\]/g, '');
    },
    getDate(pattern) {
        const currentDate = new Date();
        let date = currentDate.getDate();
        if(date < 10) {
            date = `0${date}`;
        }
        let month = currentDate.getMonth() + 1;
        if(month < 10) {
            month = `0${month}`;
        }
        const year = currentDate.getFullYear();
        return pattern
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', date)
    },
    createJsClass(rootClass) {
        return `${rootClass} js-${rootClass}`;
    },
    getDataFromLocalStorage(key, cb) {
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        } else {
            return cb();
        };
    }
};
const appendInput = data => {
    const {
        value,
        id,
        title,
        parent,
        style,
        isSelect = true,
        actions = null,
        inputClassName = 'tuiTextField',
        type = 'text',
        wrapper = 'div',
        wrapperCssClass = '',
        additionalContent = null
    } = data;
    const wrapperElement = create(wrapper, {
        className: `${wrapper === 'div' ? 'tmp-field-group' : ''} ${wrapperCssClass}`
    });
    if(title) {
        const label = create('label', {
            innerHTML: title,
            htmlFor: id,
            className: 'tmp-label'
        });
        wrapperElement.appendChild(label);
    }
    const setFieldActions = () => {
        const isSelectAction = isSelect ? {
            type: 'click',
            listener: helpers.selectAllAction
        } : null;
        if(!actions && !isSelectAction) { return };
        if (actions) {
            if (Array.isArray(actions)) {
                actions.push(isSelectAction);
                return actions;
            } else {
                return [isSelectAction, actions];
            }
        } else {
            return isSelectAction;
        }
    }
    const field = create(
        type === 'textarea' ? 'textarea' : 'input',
        {
            type: type !== 'textarea' ? type : false,
            value,
            id,
            style,
            className: inputClassName
        },
        setFieldActions()
    );
    wrapperElement.appendChild(field);
    if(additionalContent) {
        wrapperElement.appendChild(additionalContent);
    }
    parent.appendChild(wrapperElement);
};
const setRefreshBtn = (parent, wrapper = 'li') => {
    if(nfxpnk.isRefreshBtn) { return; }
    const tmpRefreshBtnID = 'tmpRefreshBtn';
    const btn = create(
        'button',
        {
            id: tmpRefreshBtnID,
            innerHTML: 'TMP',
            className: 'aui-button aui-button-primary aui-style'
        },
        {
            type: 'click',
            listener: () => {
                if(!nfxpnk.isFieldsSet) {
                    nfxpnk.init();
                }
            }
        }
    );
    addCss(`
        #${tmpRefreshBtnID} {
            background-color: red;
        }
    `);
    const wrapperElement = create(wrapper);
    wrapperElement.appendChild(btn);
    nfxpnk.isRefreshBtn = true;
    getParentNode(parent).appendChild(wrapperElement);
};
const fieldsSet = (parent, cb) => {
    const section = create('section', {
        className: 'tmp-section'
    });
    cb(section);
    addCss(`
        .tmp-section .tmp-field-group .tuiTextField {
            width: 70%;
        }
        .tmp-section .tmp-field-group .tmp-label {
            font-weight: 700;
            display: block;
            width: 70%;
            padding: 10px 0;
        }
    `);
    nfxpnk.isFieldsSet = true;
    ge(parent).parentNode.appendChild(section);
};
const additionalNameForBranchBox = parent => {
    const wrapperCssClass = 'additional-name-box';
    const fieldID = 'AdditionalNameForBranchName';
    const setFieldsBtns = () => {
        const btns = [
            {
                name: 'Add',
                action: 'add',
                bg: null
            },
            {
                name: 'Remove',
                action: 'remove',
                bg: '#c72727'
            },
            {
                name: 'Refresh',
                action: 'refresh',
                bg: '#968b03'
            }
        ];
        const updateFields = action => {
            const $field = ge(`#${fieldID}`);
            const effectedFields = [
                {
                    id: '#BranchName',
                    add() {
                        return `${nfxpnk.branchNamePattern()}-${helpers.kebabCase($field.value)}`;
                    },
                    remove() {
                        return nfxpnk.branchNamePattern();
                    }
                }
            ];
            switch (action) {
                case 'refresh':
                    $field.value = nfxpnk.issue.summary;
                    break;
                default:
                    effectedFields.forEach(field => {
                        ge(field.id).value = field[action]();
                    });
                    break;
            };
        };
        const groupClassName = 'additional-name-box__btn-group';
        const btnsWrapper = create('span', {
            className: groupClassName
        });
        addCss(`
            .${groupClassName} {
                margin-left: 15px;
            }
        `)
        btns.forEach(btn => {
            const button = create(
                'button',
                {
                    id: btn.action,
                    innerHTML: btn.name,
                    className: 'aui-button aui-button-primary aui-style'
                },
                {
                    type: 'click',
                    listener: updateFields.bind(null, btn.action)
                }
            );
            if(btn.bg) {
                button.style.backgroundColor = btn.bg;
            }
            btnsWrapper.appendChild(button);
        });
        return btnsWrapper;
    };
    appendInput({
        parent,
        value: nfxpnk.issue.summary,
        id: fieldID,
        title: 'Additional name for branch name:',
        wrapperCssClass,
        isSelect: false,
        additionalContent: setFieldsBtns()
    });
};
const filesCheckedInBox = parent => {
    const fieldID = 'FilesCheckedInText';
    const localStorageKey = `issueData_${nfxpnk.issue.key}`;
    const issueData = helpers.getDataFromLocalStorage(localStorageKey, () => {
        const prBranches = ['release', 'develop'];
        const data = {};
        prBranches.forEach(branch => {
            data[branch] = '';
        });
        return data;
    });
    const creatSummaryFieldContent = () => {
        let str = '';
        const keys = Object.keys(issueData);
        const last = keys[keys.length-1];
        for (const branch in issueData) {
            console.log('branch', issueData[branch]);
            if (issueData.hasOwnProperty(branch) && issueData[branch]) {
                str += `${branch}:\n${issueData[branch]}${branch !== last ? '\n' : ''}`;
            }
        }
        return str;
    };
    const initSummaryField = () => {
        appendInput({
            parent,
            value: creatSummaryFieldContent(),
            type: 'textarea',
            id: fieldID,
            title: `Files Checked In Text:`,
            style: {
                height: '100px',
                fontFamily: 'arial'
            }
        });
    };
    const dataFieldsAction = (branch, e) => {
        const val = e.target.value;
        if(val === issueData[branch]) { return; }
        issueData[branch] = val;
        localStorage.setItem(localStorageKey, JSON.stringify(issueData));
        const $summaryField = ge(`#${fieldID}`);
        if(!$summaryField) {
            initSummaryField();
        } else {
            $summaryField.value = creatSummaryFieldContent();
        }
    };
    let isFilesCheckedInTextareaNeeded = false;
    for (const branch in issueData) {
        if (issueData.hasOwnProperty(branch)) {
            appendInput({
                parent,
                value: issueData[branch] || '',
                id: `prField_${branch}`,
                title: `PR into ${branch}:`,
                isSelect: false,
                actions: {
                    type: 'input',
                    listener: dataFieldsAction.bind(this, branch)
                }
            });
            if(issueData[branch]) {
                isFilesCheckedInTextareaNeeded = true;
            }
        }
    }
    if(isFilesCheckedInTextareaNeeded) {
        initSummaryField();
    }
};
const createFieldBox = {
    simpleBox(section, options) {
        if(options.value.indexOf('Pattern') > 0) {
            options.value = nfxpnk[options.value]();
        }
        appendInput({
            ...options,
            parent: section
        });
    },
    additionalNameForBranchBox,
    filesCheckedInBox
}
const nfxpnk = {
    issue: {},
    css: '',
    isFieldsSet: false,
    isRefreshBtn: false,
    fieldsSet: [
        {
            value: 'commitNamePattern',
            id: 'CommitNameField',
            title: 'Commit Name:'
        },
        'additionalNameForBranchBox',
        {
            value: 'branchNamePattern',
            id: 'BranchName',
            title: 'Branch Name:'
        },
        {
            value: `${helpers.getDate('YYYYMMDD')}-${key}.impex`,
            id: 'IpmexPatchFileName',
            title: 'Ipmex patch file name:'
        },
        'filesCheckedInBox'
    ],
    commitNamePattern() {
        return `[${this.issue.key}] ${this.issue.summary}`;
    },
    branchNamePattern() {
        return `${this.issue.key}`;
    },
    playground() {
        fieldsSet('#summary-val', section => {
            this.fieldsSet.forEach(field => {
                if(typeof field === 'string') {
                    createFieldBox[field](section);
                } else {
                    createFieldBox.simpleBox(section, field);
                }
            });
        });
        appendInput({
            parent: ge("#key-val").parentNode.parentNode,
            wrapper: 'li',
            value: nfxpnk.issue.key,
            id: 'IssueNumber'
        });
        setRefreshBtn('#create-menu');
    },
    init() {
        this.issue.key = ge('#key-val').textContent.trim();
        this.issue.summary = helpers.changeStr(ge('#summary-val').textContent.trim());
        this.issue.type = ge('#type-val').textContent.trim();
        this.playground();
        create('style', this.css);
    },
};

nfxpnk.init();