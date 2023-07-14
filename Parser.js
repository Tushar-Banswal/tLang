class Parser {
    constructor(tokens, memory) {
        this.tokens = tokens;
        this.idx = 0;
        this.token = this.tokens[this.idx];
        this.memory = memory;
    }

    // factor = 0,2,3... & factor = (<exp>)
    factor() {
        if(this.token.type === 'INT' || this.token.type === 'FLOAT') {
            return this.token;
        } else if (this.token.value === '(') {
            this.move();
            const expression = this.booleanExpression();
            return expression;
        } else if(this.token.type.startsWith('VAR')) {
            return this.token;
        } else if(this.token.value === '+' || this.token.value === '-') {
            const operator = this.token;
            this.move();
            const operand = this.booleanExpression();
            return [operator, operand];
        } else if(this.token.value === 'not') {
            const operator = this.token;
            this.move();
            const operand = this.booleanExpression();
            return [operator, operand];
        }
    }

    term() {
        let leftfactor = this.factor();
        this.move();
        while(this.token.value === '*' || this.token.value === '/' || this.token.value === '%') {
            const operator = this.token;
            this.move();
            const rightfactor = this.factor();
            this.move();
            leftfactor = [leftfactor, operator, rightfactor]; 
        }
        return leftfactor;
    }

    compExpression() {
        let leftTerm = this.expression();
        while(this.token.type === 'COMP') {
            const operator = this.token;
            this.move();
            const rightTerm = this.expression();
            leftTerm = [leftTerm, operator, rightTerm];
        }
        return leftTerm; 
    }

    booleanExpression() {
        let leftTerm = this.compExpression();
        while(this.token.type === 'BOOL') {
            const operator = this.token;
            this.move();
            const rightTerm = this.compExpression();
            leftTerm = [leftTerm, operator, rightTerm];
        }
        return leftTerm;
    }

    expression() {
        let leftTerm = this.term();
        while(this.token.value === '+' || this.token.value === '-' || this.token.value === '=') {
            const operator = this.token;
            this.move();
            const rightTerm = this.term();
            leftTerm = [leftTerm, operator, rightTerm]; 
        }
        return leftTerm;
    }

    variable() {
        if(this.token.type.startsWith('VAR')) {
            return this.token;
        } else {
            throw new Error('Incorrect variable declaration');
        }
    }

    whileStatement() {
        this.move();
        let condition = this.booleanExpression();
        let action;
        if(this.token.value === 'do') {
            this.move();
            action = this.statement();
        } else if (this.tokens[this.idx-1].value === 'do') {
            action = this.statement();
        }
        return [condition, action];

    }

    ifStatement() {
        this.move();
        let condition = this.booleanExpression();
        let action;
        if(this.token.value === 'do') {
            this.move();
            action = this.statement();
        } else if (this.tokens[this.idx-1].value === 'do') {
            action = this.statement();
        }
        return [condition, action];
    }

    ifStatements() {
        const conditions = [];
        const actions = [];

        let statements = this.ifStatement();

        conditions.push(statements[0]);
        actions.push(statements[1]);
        
        while(this.token.value === 'elif' || this.tokens[this.idx-1].value === 'elif') {
            if(this.tokens[this.idx-1].value === 'elif') {
                this.idx--;
            }
            statements = this.ifStatement();
            conditions.push(statements[0]);
            actions.push(statements[1]);
        }

        if(this.token.value === 'else' || this.tokens[this.idx-1].value === 'else') {
            if(this.tokens[this.idx-1].value === 'else') {
                this.idx--;
            }
            this.move();
            this.move();
            const elseAction = this.statement();
            return [conditions, actions, elseAction];
        }
        return [conditions, actions];

    }

    statement() {
        // variable decalration
        if(this.token.type === 'DECL') {
            this.move();
            const leftTerm = this.variable();
            this.move();
            if(this.token.value === '=') { // variable assignment;
                const operator = this.token;
                this.move();
                const rightTerm = this.booleanExpression();
                return [leftTerm, operator, rightTerm];
            } else {
                throw new Error('Invalid syntax');
            }

        } // boolean expression
        else if(this.token.type === 'INT' || this.token.type === 'FLOAT' || this.token.type === 'OP' || this.token.type.startsWith('VAR') || this.token.value === 'not') {
            return this.booleanExpression();
        } // if statement
        else if(this.token.value === 'if') {
            return [this.token, this.ifStatements()];
        }

        else if(this.token.value === 'while') {
            return [this.token, this.whileStatement()];
        }
    }

    parse() {
        return this.statement();
    }

    // move to next token
    move() {
        this.idx++;
        if(this.idx < this.tokens.length) {
            this.token = this.tokens[this.idx];
        }
    }
}

export default Parser;