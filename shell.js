import ReadLine from 'readline';
import Lexer from './Lexer.js';
import Parser from './Parser.js';
import Interpreter from './Interpreter.js';
import Memory from './Memory.js';


const memory = new Memory();

const input = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });


input.setPrompt('tlang> ');
input.prompt();


input.on('line', (data) => {    
    main(data);
    input.prompt();
}).on('close', ()=>{
    process.exit(0);
})


function main(input) {
    try {
        const tokensizer = new Lexer(input);
        tokensizer.tokenise();
        // console.log(tokensizer.tokens);
        const parser = new Parser(tokensizer.tokens);
        const tree = parser.parse();
        // console.log(tree);
        const interpreter = new Interpreter(tree, memory);
        const result = interpreter.interpret();
        console.log(`> ${result}`);
    } catch(e) {
        console.error(e);
    }

    
}