export function qs(ctx) {
    return document.querySelector(ctx);
};

export function qsp(ctx) {
    return document.querySelector(ctx).parentNode;
};

export function kebabCase(string) {
    return string
        .replace(/([a-z][A-Z])/g, function(match) {
            return match.substr(0, 1) + '-' + match.substr(1, 1).toLowerCase();
        })
        .toLowerCase()
        .replace(/[^-a-z0-9]+/g, '-')
        .replace(/^-+/, '').replace(/-$/, '');
};

export function changeStr(string) {
    return string
        .replace(/\[/g, '')
        .replace(/\]/g, '');
};

export function getDate() {
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
};

export function createJsClass(rootClass) {
    return `js-${rootClass}`;
};

export function createClasses(rootClass) {
    return `${rootClass} ${createJsClass(rootClass)}`;
};

export function selectAllAction(e) {
    e.target.select();
};