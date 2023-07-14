import { Float, Integer, Operator } from "./Tokens.js";

class Interpreter {
    static falsy = ["0"]
    constructor(tree, memory) {
        this.tree = tree;
        this.memory = memory;
    }

    interpret() {
        return this.interpretHelper(this.tree);
    }


    interpretHelper(tree) {

        if(!Array.isArray(tree)) {
            if(tree.type.startsWith('VAR')) {
                tree = this.memory.read(tree.value);
            } 
            return tree;
        }

        if(tree.length === 2) {

            if(tree[0].value === 'if') {
                let i;
                let isEvaluated = false;
                for(i=0; i<tree[1][0].length; i++) {
                    let evaluate = this.interpretHelper(tree[1][0][i]);
                    if(evaluate.value !== '0') {
                        isEvaluated = true;
                        this.interpretHelper(tree[1][1][i]);
                    }
                }

                if(!isEvaluated && tree[1].length === 3) {
                    this.interpretHelper(tree[1][2]);
                }

                return;
            } else if(tree[0].value  === 'while') {
                let condition = this.interpretHelper(tree[1][0]);

                while (condition.value !== '0') {
                    this.interpretHelper(tree[1][1]);
                    condition = this.interpretHelper(tree[1][0]);
                }

                return;
            }

            let operator = tree[0];
            let operand = tree[1];
            if(Array.isArray(operand)) {
                operand = this.interpretHelper(operand);
            }
            return this.evaluteUnary(operator, operand);     
        }

        let leftNode = tree[0];
        let operator = tree[1];
        let rightNode = tree[2];


        // checking the nested subtree
        if(Array.isArray(leftNode)) {
            leftNode = this.interpretHelper(leftNode);
        }

        // checking the nested subtree
        if(Array.isArray(rightNode)) {
            rightNode = this.interpretHelper(rightNode);
        }

        return this.evaluate(leftNode, operator, rightNode);
    }

    evaluteUnary(operator, operand) {

        let operandType = operand.type;

        if(operandType.startsWith('VAR')) {
            operand = this.memory.read(operand.value);
            operandType = operand.type;
        }

        if(operator.value === 'not') {
            if(Interpreter.falsy.includes(operand.value)) {
                return new Integer('1');
            }else {
                return new Integer('0');
            }
        }
        if(operator.value === '-') {
            if(operand.value.startsWith('-')) {
                operand.value = operand.value.slice(1);
            } else {
                operand.value = `-${operand.value}`;
            }
        }
        return operand;
    }

    evaluate(left, operator, right) {
        let output;
        let leftType = left.type;
        let rightType = right.type;

        // assigning the value
        if(operator.value === '=') {
            if(right.type.startsWith('VAR')) {
                right = this.memory.read(right.value);
                rightType = right.type;
            }
            left.type = `VAR(${rightType})`
            this.memory.write(left, right);
            console.log(`${this.memory}`);
            return right;
        }

        if(leftType.startsWith('VAR')) {
            left = this.memory.read(left.value);
            leftType = left.type;
        }
        if(leftType === 'INT') {
            left = parseInt(left.value)
        } else if(leftType === 'FLOAT') {
            left = parseFloat(left.value)
        }

        if(rightType.startsWith('VAR')) {
            right = this.memory.read(right.value);
            rightType = right.type;
        }
        if(rightType === 'INT') {
            right = parseInt(right.value)
        } else if(rightType === 'FLOAT') {
            right = parseFloat(right.value)
        }


        switch(operator.value) {
            case '+':
                output = left + right;
                break;
            case '-':
                output = left - right;
                break;
            case '*':
                output = left * right;
                break;
            case '/':
                output = left / right;
                break;
            case '%':
                output = left % right;
                break;
            case '?=':
                output = (left === right? 1 : 0);
                break;
            case '!=':
                output = (left === right? 0 : 1);
                break;
            case '>':
                output = (left > right? 1 : 0);
                break;
            case '<':
                output = (left < right? 1 : 0);
                break;
            case '>=':
                output = (left >= right? 1 : 0);
                break;          
            case '<=':
                output = (left <= right? 1 : 0);
                break;
            case 'and':
                output = (left && right? 1 : 0);
                break;
            case 'or':
                output = (left || right? 1 : 0);
                break;
            default:
                throw new Error('Invalid Operation');
        }

        if(output !== undefined){ 
            let outputStr = String(output);
            // returning value with its type
            if(leftType === 'FLOAT' || rightType === 'FLOAT') {
                if(!outputStr.includes('.')) {
                    outputStr += '.0';
                }
                return new Float(outputStr);
            } else {
                return new Integer(outputStr);
            }
        }
        
        
    }
}

export default Interpreter;