class Token {
    constructor(value, type) {
        this.value = value;
        this.type = type;
    }
    toString() {
        return `${this.value}`
    }
}


class Integer extends Token{
    constructor(value) {
        super(value, "INT");
    }
}

class Float extends Token {
    constructor(value) {
        super(value, "FLOAT");
    }
}

class Operator extends Token{
    constructor(value) {
        super(value, "OP");
    }
}

class Declaration extends Token {
    constructor(value) {
        super(value, 'DECL')
    }
}
class Variable extends Token {
    constructor(value) {
        super(value, 'VAR(?)')
    }
}

class Boolean extends Token {
    constructor(value) {
        super(value, 'BOOL');
    }
}

class Comparision extends Token {
    constructor(value) {
        super(value, 'COMP');
    }
}

class Keyword extends Token {
    constructor(value) {
        super(value, 'KEYW');
    }
}

export {Token, Integer, Float, Operator, Declaration, Variable, Boolean, Comparision, Keyword};