import { execSync } from 'child_process';
import * as path from 'path';

describe('Command-line interface', () => {
  const cliPath = path.join(__dirname, '../dist/lookup-cli.js');

  it('should return the correct field value for a given name', () => {
    const output = execSync(`node ${cliPath} Alice age`).toString();
    expect(output.trim()).toBe('18');
  });

  it('should return "Name not found" if the name is not in the YAML file', () => {
    const output = execSync(`node ${cliPath} Eve age`).toString();
    expect(output.trim()).toBe('Name not found');
  });

  it('should return an error message if the field is not found for the given name', () => {
    const output = execSync(`node ${cliPath} Charlie occupation`).toString();
    expect(output.trim()).toBe("Field 'occupation' not found for 'Charlie'. Available fields: 'name', 'age'.");
  });

  it('should display the help message if no arguments are provided', () => {
    const output = execSync(`node ${cliPath}`).toString();
    expect(output).toContain('Usage: lookup-cli <name> <output_field>');
  });
});
