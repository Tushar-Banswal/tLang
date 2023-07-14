export default class Memory {
    constructor() {
        this.memory = {};
    }

    read(index) {
        return this.memory[index];
    }

    write(index, value) {
        this.memory[index] = value;
        return this.memory[index];
    }

    toString() {
        const keys = Object.keys(this.memory);
        let str = '{ ';
        keys.forEach((key, i) => {
            str += `${i===0?"":", "}${key} : ${this.memory[key].value}`
        })
        str += ' }'
        return str;
    }

}