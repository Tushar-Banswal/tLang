import { Integer, Operator, Float, Declaration, Variable, Boolean, Comparision, Keyword } from "./Tokens.js";


class Lexer {
    static digits = "0123456789.";
    static alphabates = "abcdefghijklmnopqrstuvwxyz"
    static operators = "+-*/%()=";
    static declarations = ["take"];
    static booleanOperators = ["and", "or", "not"];
    static comparisionOperators = [">", "<", ">=", "<=", "?=", "!="];
    static specialChars = "><=!?";
    static keywords = ["if", "elif", "else", "do", "while"];

    constructor(text) {
        this.text = text;
        this.tokens = [];
        this.token = null;
        this.idx = 0;
        this.char = this.text[this.idx];
    }

    tokenise() {
        while(this.idx < this.text.length) {
            // checking for digits and decimal point
            if(Lexer.digits.includes(this.char)) {
               this.token = this.extractOperand();
            } else if (Lexer.operators.includes(this.char)) { // check the operators
                this.token = new Operator(this.char);
                this.move();
            } else if(this.char === " " || this.char === '\t') { // check the spaces and tabs
                this.move();
                continue;
            } else if(Lexer.alphabates.includes(this.char)) {
                const word = this.extractWord();
                if(Lexer.declarations.includes(word)) { // checking for keyword take
                    this.token = new Declaration(word);
                } else if(Lexer.booleanOperators.includes(word)) { // checking for boolean operators
                    this.token = new Boolean(word);
                } else if(Lexer.keywords.includes(word)) { // checking for reserved words
                    this.token = new Keyword(word);
                }
                else { // making a variable namely
                    this.token = new Variable(word);
                }
            } else if(Lexer.specialChars.includes(this.char)) {
                const compOperator = this.extractCompOperator();
                if(Lexer.comparisionOperators.includes(compOperator)) {
                    this.token = new Comparision(compOperator);
                }
            }
            else { // raise an error when unexpected found
                throw new Error('Invalid Syntax');
            }

            this.tokens.push(this.token);
        }
    }

    // get the whole token when token is like 123....
    extractOperand() {
        let operand = "";
        let isFloat = false;
        while((this.idx < this.text.length) && (Lexer.digits.includes(this.char))) {
            //handling the floating value
            if(this.char === ".") {
                if(isFloat) {
                    this.move();
                    continue;
                }
                isFloat = true;
            }
            operand += this.char;
            this.move();
        }
        return isFloat ? new Float(operand) : new Integer(operand);
    }

    extractCompOperator() {
        let operator = '';
        while(Lexer.specialChars.includes(this.char) && this.idx < this.text.length) {
            operator += this.char;
            this.move();
        }
        return operator;
    }

    extractWord() {
        let word = '';
        while(Lexer.alphabates.includes(this.char) && this.idx < this.text.length) {
            word += this.char;
            this.move();
        }
        return word;
    }

    // move to the next char
    move() {
        this.idx++;
        if(this.idx < this.text.length) {
            this.char = this.text[this.idx];
        }
    }
}



export default Lexer;