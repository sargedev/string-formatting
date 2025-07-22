
namespace text {
    export class Format {
        private index: number;
        private char: string;
        private parsed: string[];
        private paramNum: number;
        private text: string;

        constructor(text: string) {
            this.text = text;
            this.index = -1;
            this.char = null;
            this.paramNum = 0;
            this.advance();
            this.parsed = this.parse();
        }

        private advance() {
            this.index += 1;
            this.char = this.index < this.text.length ? this.text[this.index] : null;
        }

        private parse() {
            let parsed: string[] = [];
            let segment = "";
            
            while (this.char !== null) {
                if (this.char === "{") {
                    if (segment) {
                        parsed.push(segment);
                        segment = "";
                    }
                    if (this.makeField()) parsed.push(null);
                    else segment += this.char !== null ? "{" + this.char : "{";
                    this.advance();
                    
                } else if (this.char === "\\") {
                    segment += this.makeEscapeChar();
                    this.advance();
                } else {
                    segment += this.char;
                    this.advance();
                }
            }

            if (segment) parsed.push(segment);
            return parsed;
        }

        private makeField() {
            this.advance();
            if (this.char !== "}") return false;

            this.paramNum += 1;
            return true;
        }

        private makeEscapeChar() {
            this.advance();
            if (this.char === "{") {
                return "{";
            } else if (this.char === "\\") {
                return "\\";
            } else {
                throw `Invalid escape character '\\${this.char || ""}'`;
            }
        }

        format(params?: string[]): string {
            params = params || [];
            let result = "";
            let index = 0;
            for (let i = 0; i < this.parsed.length; i++) {
                if (this.parsed[i] === null) {
                    if (index >= params.length) throw `Expected ${this.paramNum} param(s) (got ${params.length})`;
                    result += params[index];
                    index += 1;
                } else result += this.parsed[i];
            }
            return result;
        }
    }

    /**
     * Insert values into preformatted text
     * Throws exception if too few arguments are provided
     * Excess values are ignored
     * @param text Placeholder text (use {} to create a field)
     * @param params String array that maps to fields in text parameter
     */
    //% block="format $text with $params"
    //% text.defl="Format this text {}!"
    export function format(text: string, params: string[]): string {
        return new Format(text).format(params);
    }
}