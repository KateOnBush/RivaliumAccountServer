export default class Message {

    private readonly c: any = {};
    protected r?: string;
    protected s?: string;
    private readonly e: string;

    get content() {
        return this.c;
    }
    get reply() {
        return this.r;
    }
    get status() {
        return this.s;
    }
    get event() {
        return this.e;
    }

    constructor(event: string, content: any = {}) {
        this.e = event;
        this.c = content;
    }

    bake() {
        return JSON.stringify(this) + "\0";
    }

}