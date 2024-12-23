"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readYAMLFile = void 0;
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
const commander_1 = require("commander");
const program = new commander_1.Command();
const readYAMLFile = (filePath) => {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return yaml.load(fileContents);
    }
    catch (e) {
        if (isError(e) && e.code === 'ENOENT') {
            console.error('Error: YAML file not found at the specified location. Please check the file path and try again.');
        }
        else {
            console.error('Error: YAML file is not properly formatted. Please check the file content and try again.');
        }
        process.exit(1);
    }
};
exports.readYAMLFile = readYAMLFile;
const isError = (error) => {
    return error instanceof Error && 'code' in error;
};
const helpMessage = () => {
    console.log(`
Usage: lookup-cli <name> <output_field>
Description: This command-line tool looks up a specified field for a given name in a YAML file.

Parameters:
  <name>: The name to lookup in the YAML file.
  <output_field>: The field to return for the given name (e.g., age, occupation).

Options:
-f, --file <path>   Path to the YAML file (default: 'data.yaml')

Examples:
  lookup-cli Alice age - Returns the age of Alice.
  lookup-cli Bob occupation - Returns the occupation of Bob.

Error Messages:
  Name not found - If the specified name is not found in the YAML file.
  Field not found - If the specified field is not found for the given name.
  Error: YAML file not found at the specified location. Please check the file path and try again. - If the YAML file is not found.
  Error: YAML file is not properly formatted. Please check the file content and try again. - If the YAML file is malformed.
  `);
};
program
    .arguments('<name> <output_field>')
    .option('-f, --file <path>', 'Path to the YAML file', 'data.yaml')
    .action((name, outputField, options) => {
    const filePath = options.file;
    const data = (0, exports.readYAMLFile)(filePath);
    const nameLower = name.toLowerCase();
    const outputFieldLower = outputField.toLowerCase();
    const matches = data.filter(entry => entry.name.toLowerCase() === nameLower);
    if (matches.length === 0) {
        console.log('Name not found');
        return;
    }
    matches.forEach(match => {
        if (outputFieldLower in match) {
            console.log(match[outputFieldLower]);
        }
        else {
            console.error(`Field not found`);
        }
    });
}).on('--help', helpMessage);
if (!process.argv.slice(2).length) {
    console.error(`Usage: lookup-cli <name> <output_field>`);
    console.error(`Try 'lookup-cli --help' for more information.`);
    process.exit(1);
}
// Run the program
program.parse(process.argv);
