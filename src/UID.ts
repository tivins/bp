let globalUID = 1;

export class UID {
    protected uid = 0

    constructor() {
        this.uid = globalUID;
        globalUID++;
    }

    forceUID(uid: number) {
        this.uid = uid;
        if (globalUID < this.uid) {
            globalUID = this.uid + 1;
        }
    }

    static reset() {
        globalUID = 0;
    }
}