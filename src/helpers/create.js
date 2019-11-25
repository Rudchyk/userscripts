export function input(value, id, className, type = 'text') {
        const input = document.createElement('input');
        input.type = type;
        input.value = value;
        input.id = id;
        if(className) {
            input.className = className;
        }

        return input;
    };

export function label(title, id, className) {
    const label = document.createElement('label');
    label.innerHTML = title;
    if(className) {
        label.className = className;
    }
    label.htmlFor = id;

    return label;
};

export function btn(title, className, fn = null, type = 'button') {
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
};

export function image(alt, src, className) {
    const img = document.createElement('img');
    img.alt = alt;
    img.src = src;
    if(className) {
        img.className = className;
    }

    return img;
};

export function link(href, title, className, fn = null) {
    const a = document.createElement('a');
    a.href = href;
    if(className) {
        a.className = className;
    }
    a.innerHTML = title;
    if(fn) {
        a.addEventListener('click', fn);
    }
    return a;
};

export function style(css) {
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
};

export function container(tag, className = null, content = null) {
    const container = document.createElement(tag);
    if(className) {
        container.className = className;
    }
    container.innerHTML = content;

    return container;
};