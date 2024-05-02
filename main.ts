
namespace text {
    class Format {
        private index: number;
        private char: string;
        private parsed: string[];
        private paramNum: number;
        text: string;

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
                    this.makeField();
                    parsed.push(null);
                    this.paramNum += 1;
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
            if (this.char === "}") {
                this.advance();
            }
        }

        format(params: string[]) {
            let index = 0;
            for (let i = 0; i < this.parsed.length; i++) {
                if (this.parsed[i] === null) {
                    if (index >= params.length) throw `Expected ${this.paramNum} params (got ${params.length})`;
                    this.parsed[i] = params[index];
                    index += 1;
                }
            }
            return this.parsed.join("");
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
    export function format(text: string, params: string[]) {
        return new Format(text).format(params);
    }
}