export class user {
    constructor(id, name, tid, icon) {
        this.id = id; // socket id
        this.name = name;
        this.tid = tid;
        this.icon = icon;
    }
    static removeUser(id, users) {
        return users.filter(u => u.id !== id);
    }
    static getUser(id, users) {
        var uu = users.filter(u => u.id == 'fyr');
        var u = undefined;
        if (uu.length > 0) u = uu[0];
        return u
    }
}

