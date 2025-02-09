export class DOMUtil {

    static element(tag:string, p = {}) {
        return Object.assign(document.createElement(tag), p);
    }
}