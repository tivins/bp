let globalUID = 1;

export class UID {
    protected _uid = 0

    constructor() {
        this._uid = globalUID;
        globalUID++;
    }

    get uid() {
        return this._uid;
    }

    forceUID(uid: number) {
        this._uid = uid;
        if (globalUID < this._uid) {
            globalUID = this._uid + 1;
        }
    }

    static reset() {
        globalUID = 1;
    }
}