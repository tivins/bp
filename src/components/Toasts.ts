
export class Toasts {

    static #instance:Toasts|null = null;

    static get instance():Toasts {
        if (this.#instance === null) {
            this.#instance = new Toasts();
        }
        return this.#instance;
    }

    private readonly container:HTMLElement;

    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'toasts';
        document.body.append(this.container);

        const toastInterval = setInterval(() => {
            document.querySelectorAll('.toast').forEach(el => {
                const end = parseInt(el.getAttribute('data-end') ?? '');
                if (end && new Date().getTime() > end && (el as HTMLElement).dataset['mouse'] !== '1') {
                    this.toastHide(el);
                }
            });
        }, 1000);
    }


    addToast(msg: string|HTMLElement[], lifetime = 5, type = "default", closeBtnHTML = null, icon:{name:string,size:string|null}|null = null) {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        // if (type === 'error') toast.style.backgroundColor="#633"
        // if (type === 'success') toast.style.backgroundColor="#363"
        if (lifetime > 0) {
            toast.setAttribute('data-end', (new Date().getTime() + lifetime * 1000).toString())
        }
        if (icon) {
            toast.innerHTML = `<tivins-icon icon="${icon.name}" class="accent p-2 text-${icon.size ?? 'xl'}"></tivins-icon>`;
        }

        if (typeof msg === 'string') {
            toast.innerHTML += msg;
        } else {
            toast.append(...msg)
        }
        const a = document.createElement('a');
        a.innerHTML = closeBtnHTML ?? '<i class="fa fa-times"></i>';
        a.className = 'button empty flat-left';
        a.style.borderRadius = '0';
        toast.append(a);
        a.addEventListener('click', e => {
            e.preventDefault();
            this.toastHide(toast);
        })
        toast.addEventListener('mouseenter', () => {
            toast.dataset.mouse = "1";
        });
        toast.addEventListener('mouseleave', () => {
            toast.dataset.mouse = "0";
        });
        this.container.prepend(toast);
        setTimeout(() => {
            toast.classList.add('show')
        }, 100)
    }

    addToastDefault(msg:string, lifetime = 5, type = "default", closeBtnHTML = null, icon = null) {
        this.addToast(`<div class="p-1">${msg}</div>`, lifetime, type, closeBtnHTML, icon);
    }


    toastHide(toast:Element) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.parentNode?.removeChild(toast);
        }, 500)
    }
}
