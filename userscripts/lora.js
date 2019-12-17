// ==UserScript==
// @name        JIRA issue helpers for LORA
// @namespace   https://jira.e-loreal.com/
// @include     https://jira.e-loreal.com/*
// @version     1
// @grant       none
// ==/UserScript==

const nfxpnk = {
    $issueKey: null,
    $summaryVal: null,
    issueKeyText: null,
    summaryValText: null,
    typeValText: null,
    commitType: null,
    branchType: null,
    $section: null,
    generalBtnClasses: 'aui-button aui-button-primary aui-style',
    generalFieldsClasses: 'tmp-field-group js-tpm-field-group',
    generalLabelClasses: 'tmp-label',
    generalSectionClass: 'tmp-section',

    ge(ctx) {
        return document.querySelector(ctx);
    },

    getParentNode(ctx) {
        return this.ge(ctx).parentNode;
    },

    create: {
        input(value, id, className, type = 'text') {
            const input = document.createElement('input');
            input.type = type;
            input.value = value;
            input.id = id;
            if(className) {
                input.className = className;
            }

            return input;
        },

        label(title, id, className) {
            const label = document.createElement('label');
            label.innerHTML = title;
            if(className) {
                label.className = className;
            }
            label.htmlFor = id;

            return label;
        },

        btn(title, className, fn = null, type = 'button') {
            const btn = document.createElement('button');
            btn.type = type;
            btn.innerHTML = title;
            if(className) {
                btn.className = className;
            }
            if(fn) {
                btn.addEventListener('click', fn);
            }

            return btn;
        },

        style(css) {
            const head = document.head || document.getElementsByTagName('head')[0];
            const style = document.createElement('style');
            style.type = 'text/css';

            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
        },

        container(tag, className = null, content = null) {
            const container = document.createElement(tag);
            if(className) {
                container.className = className;
            }
            container.innerHTML = content;

            return container;
        },
    },

    helpers: {
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

        getDate() {
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
            return year + month + date;
        },

        createJsClass(rootClass) {
            return `js-${rootClass}`;
        },

        createClasses(rootClass) {
            return `${rootClass} ${this.createJsClass(rootClass)}`;
        }
    },

    selectAllAction(e) {
        e.target.select();
    },

    appendTextInput(parentElement, value, id, title, isNoSelect, divClassName, inputClassName = 'tuiTextField') {
        const divClasses = divClassName ? `${this.generalFieldsClasses} ${divClassName}` : this.generalFieldsClasses;
        const div = this.create.container(
            'div',
            divClasses
        );

        if(title) {
            const label = this.create.label(
                title,
                id,
                this.generalLabelClasses
            );
            div.appendChild(label);
        }

        const input = this.create.input(
            value,
            id,
            inputClassName
        );

        if(!isNoSelect) {
            input.addEventListener('click', this.selectAllAction)
        }

        div.appendChild(input);

        parentElement.appendChild(div);
    },

    createFullCommitMessage() {
        return `${this.commitType}(${this.issueKeyText}): ${this.issueComponent} - ${this.summaryValText}.`;
    },

    createBranchName() {
        return `${this.branchType}/${this.issueKeyText}`;
    },

    start() {
        this.$issueKey = this.ge('#key-val');
        this.$summaryVal = this.ge('#summary-val');
        this.summaryValText = this.helpers.changeStr(this.$summaryVal.textContent.trim());
        this.issueKeyText = this.$issueKey.textContent.trim();
        this.typeValText = this.ge('#type-val').textContent.trim();
        this.setIssueType();
        this.setIssueComponent();
    },

    setIssueType() {
        const isBugType = this.typeValText === 'Bug';
        this.commitType = isBugType ? 'fix' : 'feat';
        this.branchType = isBugType ? 'bugfix' : 'feature';
    },

    setIssueComponent() {
        const boo = this.ge('#components-field a');
        if(!boo) {
            return;
        }
        const componentText = boo.innerHTML;
        let component = 'GLOBAL';
        if(componentText.indexOf('PLP') > -1) {
            component = 'PLP';
        } else if (componentText.indexOf('PLP') > -1) {
            component = 'CHECKOUT';
        } else if (componentText.indexOf('CHECKOUT') > -1) {
            component = 'PDP';
        } else if (componentText.indexOf('PDP') > -1) {
            component = 'HP';
        } else if (componentText.indexOf('HP') > -1) {
            component = 'CART';
        } else if (componentText.indexOf('CART') > -1) {
            component = 'MYACCOUNT';
        } else if (componentText.indexOf('MYACCOUNT') > -1) {
            component = 'MYACCOUNT';
        } else if (componentText.indexOf('MISC') > -1) {
            component = 'MISC';
        }
        this.issueComponent = component;
    },

    createFieldsSet() {
        this.$section = this.create.container(
            'section',
            this.helpers.createClasses(this.generalSectionClass)
        );
        this.$summaryVal.parentNode.appendChild(this.$section);
        this.fieldsSetInit();
        this.setRefreshBtn();
    },

    fieldsSetInit() {
        this.setIssueNumber();
        this.setCommitName();
        this.setBranchName();
    },

    setIssueNumber() {
        this.appendTextInput(
            this.$issueKey.parentNode.parentNode,
            this.issueKeyText,
            'IssueNumber',
            false,
            false,
            'tuiTextField issue-number-field'
        );
    },

    setCommitName() {
        this.appendTextInput(
            this.$section,
            this.createFullCommitMessage(),
            'CommitNameField',
            'Commit Name:'
        );
    },

    setRefreshBtnAction() {
        if(!this.ge(`.js-${this.generalSectionClass}`)) {
            nfxpnk.init();
        }
    },

    setRefreshBtn() {
        const refreshBtnClass = 'tmp-refresh-btn';

        if(this.ge(`.${this.helpers.createJsClass(refreshBtnClass)}`)) {
            return;
        }

        const parent = this.getParentNode('#create-menu');
        const btn = this.create.btn(
            'TMP',
            `${this.generalBtnClasses} ${this.helpers.createClasses(refreshBtnClass)}`,
            this.setRefreshBtnAction.bind(this)
        );
        btn.id = 'tmpRefreshBtn';
        const li = this.create.container('li');
        li.appendChild(btn);
        parent.appendChild(li);
    },

    setBranchName() {
        this.appendTextInput(
            this.$section,
            this.createBranchName(),
            'BranchName',
            'Branch Name:'
        );
    },

    init() {
        this.start();

        const css = `
            .issue-number-field {
                width: auto;
                border: none;
                padding-left: 0;
            }
            .tmp-section .tmp-field-group .tuiTextField {
                width: 70%;
            }
            .additional-name-box .aui-button {
                margin-left: 10px;
            }
            .tmp-label {
                font-weight: 700;
                display: block;
                width: 70%;
                padding: 10px 0;
            }
            #tmpRefreshBtn {
                background-color: red;
            }
            .assign-links-section span {
                margin-bottom: 5px;
                display: block;
            }
            .assign-links-section .aui-button {
                margin-bottom: 10px;
            }
            #getPersonData {
                background-color: #1dd470;
            }
            .jira-dialog .my-jira-dialog-heading h2 {
                display: flex;
                justify-content: space-between;
            }
        `;

        this.create.style(css);

        this.createFieldsSet();
    },
};

// export default nfxpnk;
nfxpnk.init();