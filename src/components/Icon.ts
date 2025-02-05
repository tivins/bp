
/**
 * Usage:
 *
 * ```html
 * <head><script src="path/to/Icon.js"></script></head>
 * <body><tivins-icon icon="user" outline></tivins-icon></body>
 * ```
 */
export class Icon extends HTMLElement {
    icon:HTMLElement;
    constructor() {
        super();


        const fontURL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
        const shadow = this.attachShadow({mode: 'closed'});
        const style = document.createElement('style');
        style.textContent = `@import url('${fontURL}');`;

        this.icon = document.createElement('i');
        this.update();
        shadow.append(style, this.icon);

        if (!document.querySelector('link[href*="font-awesome"]')) {
            const l = document.createElement('link');
            l.rel = 'stylesheet';
            l.type = 'text/css';
            l.href = fontURL;
            document.head.append(l);
        }
    }

    update() {
        const style = 'fa-' + (this.hasAttribute('outline') ? 'regular' : 'solid');
        const iconName = ' ' + 'fa-' + (this.getAttribute('icon') || 'star');
        const fixedWidth = this.hasAttribute('fw') ? ' fa-fw' : '';
        this.icon.className = style + iconName + fixedWidth;
    }

    static get observedAttributes() {
        return ['icon', 'fw', 'outline'];
    }

    attributeChangedCallback(name:string, oldValue:string, newValue:string) {
        if (name === 'icon' || name === 'fw' || name === 'outline') {
            this.update();
        }
    }

}

customElements.define('tivins-icon', Icon);