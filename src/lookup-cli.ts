import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Command } from 'commander';
const program = new Command();

// Define the YAML data type
interface YAMLData {
  name: string;
  age?: number;
  occupation?: string;
  [key: string]: any;
}

/**
 * Reads and parses a YAML file from the given file path.
 *
 * @param {string} filePath - The path to the YAML file to read.
 * @returns {YAMLData[]} - An array of parsed YAML data objects.
 * @throws {Error} - If the file is not found or cannot be read.
 * @throws {Error} - If the YAML file is improperly formatted.
 *
 * @example
 * // Example usage:
 * const data = readYAMLFile('data.yaml');
 * console.log(data);
 */
export const readYAMLFile = (filePath: string): YAMLData[] => {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents) as YAMLData[];
  } catch (e: unknown) {
    if (isError(e) && e.code === 'ENOENT') {
      console.error('Error: YAML file not found at the specified location. Please check the file path and try again.');
    } else {
      console.error('Error: YAML file is not properly formatted. Please check the file content and try again.');
    }
    process.exit(1);
  }
}

/**
 * Type guard to check if a given error is a `NodeJS.ErrnoException`.
 *
 * @param {unknown} error - The value to check.
 * @returns {error is NodeJS.ErrnoException} - `true` if the error is a `NodeJS.ErrnoException`, otherwise `false`.
 */
const isError = (error: unknown): error is NodeJS.ErrnoException => {
  return error instanceof Error && 'code' in error;
}

/**
 * Displays the help message for the `lookup-cli` tool.
 *
 * @returns {void} - This function does not return a value.
 */
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
}

// Define the command-line
program
  .arguments('<name> <output_field>')
  .option('-f, --file <path>', 'Path to the YAML file', 'data.yaml')
  .action((name: string, outputField: string, options) => {
    const filePath = options.file;
    const data = readYAMLFile(filePath);
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
      } else {
        console.log(`Field not found`);
      }
    });
  }).on('--help', helpMessage);

// Display help message if no arguments are provided
if (!process.argv.slice(2).length) {
  console.log(`Usage: lookup-cli <name> <output_field>`)
  console.log(`Try 'lookup-cli --help' for more information.`)
  process.exit(1);
}

// Run the program
program.parse(process.argv);