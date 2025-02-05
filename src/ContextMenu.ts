
export class ContextMenu extends HTMLElement {
    menuElement: Element;
    private inputElement: HTMLInputElement | null;
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });
        shadow.innerHTML = `
            <style>
                :host {
                    position: absolute;
                    display: none;
                    background: rgb(0,0,0,70%);
                    /*background-color: white;*/
                    border: 1px solid #000;
                    border-radius: 4px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    padding: 4px;
                    z-index: 1000;
                    max-height: 50vh; 
                    overflow: scroll;
                }
                .menu-item {
                    padding: 4px 8px;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .menu-item:hover {
                    background-color: #345;
                }
                input{padding:5px 10px;font-family:inherit;font-size:inherit;background:rgb(0,0,0,50%);color:#ccc;border:none;}
                input:focus{outline:none}
            </style>
            <input type="search" value=""><hr>
            <div id="menu"></div>
        `;

        const menu = shadow.querySelector('#menu');
        if (menu === null) {
            throw new Error("menu not found");
        }
        this.menuElement = menu;
        this.inputElement = shadow.querySelector('input');
        if (this.inputElement) {

            this.inputElement.addEventListener('keyup', (e: KeyboardEvent) => {
                if (e.key === "Enter" && this.menuElement) {
                    this.menuElement.childNodes.forEach(menu => {
                        if ((menu as HTMLElement).style.display === 'block') {
                            menu.dispatchEvent(new Event('click'))
                        }
                    })
                    const text = (e.currentTarget as HTMLInputElement).value;
                    this.menuElement.childNodes.forEach(menu => {
                        if (menu) {
                            // @ts-ignore
                            menu.style.display = menu.textContent.toLowerCase().indexOf(text.toLowerCase()) === -1 ? 'none' : 'block';
                        }
                    })
                }
            })
        }
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    connectedCallback() {
        document.addEventListener('click', this.handleClickOutside);
    }

    disconnectedCallback() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    // Ajout d'une option au menu
    addItem(label:string, callback:Function) {
        if (!this.menuElement) {
            console.error("MenuElement is not defined");
            return;
        }

        const item = document.createElement('div');
        item.classList.add('menu-item');
        item.textContent = label;
        item.addEventListener('click', e => {
            callback();
            this.hide();
        });
        this.menuElement.appendChild(item);
    }

    addSeparator() {
        this.menuElement?.append(document.createElement('hr'))
    }

    // Affiche le menu à la position donnée (x, y)
    show(x:number, y:number) {
        if (!this.inputElement) {
            return;
        }
        this.style.display = 'block';
        this.inputElement.value = '';
        this.inputElement.focus()
        if (y + this.offsetHeight > window.innerHeight) {
            y = window.innerHeight - this.offsetHeight;
        }
        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
    }

    // Cache le menu
    hide() {
        this.style.display = 'none';
    }

    // Gestion de la fermeture en cliquant en dehors du menu
    handleClickOutside(event:MouseEvent) {
        // @ts-ignore
        if (!this.contains(event.target)) {
            this.hide();
        }
    }

    static getInstance():ContextMenu {
        const menu = document.querySelector('tivins-ctx-menu') || new ContextMenu();
        if (!document.body.contains(menu)) document.body.appendChild(menu);
        return (menu as ContextMenu);
    }
}

customElements.define('tivins-ctx-menu', ContextMenu);