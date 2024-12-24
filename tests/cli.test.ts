import { execSync } from 'child_process';
import { expect } from 'chai';

describe('Command-line interface', () => {
  it('should return the correct field value for a given name', () => {
    const output = execSync(`npx tsx src/lookup-cli.ts Alice age`).toString();
    const lines = output.trim().split('\n');
    expect(lines).contain('18');
  });
  
  it('should return the correct field value for a given name if there is multiple matching data matches', () => {
    const output = execSync(`npx tsx src/lookup-cli.ts Alice age`).toString();
    const lines = output.trim().split('\n');
    expect(lines).contain('18');
    expect(lines).contain('20');
  });

  it('should return the correct field value for another name', () => {
    const output = execSync(`npx tsx src/lookup-cli.ts Bob age`).toString();
    expect(output.trim()).to.equal('33');
  });

  it('should return "Name not found" if the name is not in the YAML file', () => {
    const output = execSync(`npx tsx src/lookup-cli.ts Eve age`).toString();
    expect(output.trim()).to.equal('Name not found');
  });

  it('should return an error message if the field is not found for the given name', () => {
    const output = execSync(`npx tsx src/lookup-cli.ts Charlie phone`).toString();
    expect(output.trim()).to.equal('Field not found');
  });
  
  it('should display the help message if no arguments are provided', () => {
    try {
      execSync(`npx tsx src/lookup-cli.ts`, { stdio: 'pipe' });
    } catch (error: any) {
      const output = error.stdout.toString(); // Check stdout for the output
      expect(output).to.include('Usage: lookup-cli <name> <output_field>');
    }
  });

  it('should display the help message if the --help argument is provided', () => {
    const output = execSync(`npx tsx src/lookup-cli.ts --help`).toString();
    expect(output).to.include(`Usage: lookup-cli [options] <name> <output_field>

Options:
  -f, --file <path>  Path to the YAML file (default: "data.yaml")
  -h, --help         display help for command

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
  Error: YAML file is not properly formatted. Please check the file content and try again. - If the YAML file is malformed.`);
  });

  it('should display an error message if the YAML file doesn\'t exist', () => {
    try {
      execSync(`npx tsx src/lookup-cli.ts alice age -f test.yaml`, { stdio: 'pipe' });
    } catch (error: any) {
      const output = error.stderr.toString();
      expect(output).to.include('Error: YAML file not found at the specified location. Please check the file path and try again.');
    }
  });
});