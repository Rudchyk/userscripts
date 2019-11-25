import { qs, qsp, createClasses, createJsClass, changeStr } from './helpers/helpers';
import { container, btn, style } from './helpers/create';
import { appendTextInput } from './helpers/appendTextInput';

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
    generalSectionClass: 'tmp-section',

    createFullCommitMessage() {
        return `${this.commitType}(${this.issueKeyText}): ${this.issueComponent} - ${this.summaryValText}.`;
    },

    createBranchName() {
        return `${this.branchType}/${this.issueKeyText}`;
    },

    start() {
        this.$issueKey = qs('#key-val');
        this.$summaryVal = qs('#summary-val');
        this.summaryValText = changeStr(this.$summaryVal.textContent.trim());
        this.issueKeyText = this.$issueKey.textContent.trim();
        this.typeValText = qs('#type-val').textContent.trim();

        const isBugType = this.typeValText === 'Bug';
        this.commitType = isBugType ? 'fix' : 'feat';
        this.branchType = isBugType ? 'bugfix' : 'feature';
        this.setIssueComponent();
    },

    setIssueComponent() {
        const componentText = qs('#components-field a').innerHTML;
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
        this.$section = container(
            'section',
            createClasses(this.generalSectionClass)
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
        appendTextInput(
            this.$issueKey.parentNode.parentNode,
            this.issueKeyText,
            'IssueNumber',
            false,
            false,
            'tuiTextField issue-number-field'
        );
    },

    setCommitName() {
        appendTextInput(
            this.$section,
            this.createFullCommitMessage(),
            'CommitNameField',
            'Commit Name:'
        );
    },

    setBranchName() {
        appendTextInput(
            this.$section,
            this.createBranchName(),
            'BranchName',
            'Branch Name:'
        );
    },

    setRefreshBtnAction() {
        if(!qs(`.js-${this.generalSectionClass}`)) {
            nfxpnk.init();
        }
    },

    setRefreshBtn() {
        const refreshBtnClass = 'tmp-refresh-btn';

        if(qs(`.${createJsClass(refreshBtnClass)}`)) {
            return;
        }

        const parent = qsp('#create-menu');
        const btnEl = btn(
            'TMP',
            `${this.generalBtnClasses} ${createClasses(refreshBtnClass)}`,
            this.setRefreshBtnAction.bind(this)
        );
        btnEl.id = 'tmpRefreshBtn';
        const li = this.create.container('li');
        li.appendChild(btnEl);
        parent.appendChild(li);
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

        style(css);

        this.createFieldsSet();
    }
};

nfxpnk.init();