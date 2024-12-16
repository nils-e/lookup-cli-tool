import { readYAMLFile } from '../src/lookup-cli';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

jest.mock('fs');
jest.mock('js-yaml');

describe('readYAMLFile', () => {
  it('should read and parse a valid YAML file', () => {
    const filePath = 'data.yaml';
    const fileContents = 'name: Alice\nage: 30\noccupation: Engineer';
    const parsedData = { name: 'Alice', age: 30, occupation: 'Engineer' };

    (fs.readFileSync as jest.Mock).mockReturnValue(fileContents);
    (yaml.load as jest.Mock).mockReturnValue(parsedData);

    const result = readYAMLFile(filePath);

    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
    expect(yaml.load).toHaveBeenCalledWith(fileContents);
    expect(result).toEqual(parsedData);
  });

  it('should handle file not found error', () => {
    const filePath = 'data.yaml';
    const error = new Error('File not found');
    (error as any).code = 'ENOENT';

    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw error;
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    expect(() => readYAMLFile(filePath)).toThrow('process.exit called');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: YAML file not found at the specified location. Please check the file path and try again.');
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  it('should handle YAML parsing error', () => {
    const filePath = 'data.yaml';
    const fileContents = 'invalid: yaml: content';
    const error = new Error('YAML parsing error');

    (fs.readFileSync as jest.Mock).mockReturnValue(fileContents);
    (yaml.load as jest.Mock).mockImplementation(() => {
      throw error;
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    expect(() => readYAMLFile(filePath)).toThrow('process.exit called');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: YAML file is not properly formatted. Please check the file content and try again.');
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
