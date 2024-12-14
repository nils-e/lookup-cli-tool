const fs = require('fs');
const yaml = require('js-yaml');
const { Command } = require('commander');
const program = new Command();

function readYAMLFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents);
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error('Error: YAML file not found at the specified location. Please check the file path and try again.');
    } else {
      console.error('Error: YAML file is not properly formatted. Please check the file content and try again.');
    }
    process.exit(1);
  }
}

program
  .arguments('<name> <output_field>')
  .action((name, outputField) => {
    const data = readYAMLFile('data.yaml');
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
        const availableFields = Object.keys(match).join(', ');
        console.log(`Field '${outputField}' not found for '${name}'. Available fields: ${availableFields}.`);
      }
    });
  })
  .on('--help', () => {
    console.log('');
    console.log('Usage: lookup-cli <name> <output_field>');
    console.log('Description: This command-line tool looks up a specified field for a given name in a YAML file.');
    console.log('Parameters:');
    console.log('  <name>: The name to lookup in the YAML file.');
    console.log('  <output_field>: The field to return for the given name (e.g., age, occupation).');
    console.log('Examples:');
    console.log('  lookup-cli Alice age - Returns the age of Alice.');
    console.log('  lookup-cli Bob occupation - Returns the occupation of Bob.');
    console.log('Error Messages:');
    console.log('  Name not found - If the specified name is not found in the YAML file.');
    console.log('  Field \'occupation\' not found for \'Charlie\'. Available fields: \'name\', \'age\'. - If the specified field is not found for the given name.');
    console.log('  Error: YAML file not found at the specified location. Please check the file path and try again. - If the YAML file is not found.');
    console.log('  Error: YAML file is not properly formatted. Please check the file content and try again. - If the YAML file is malformed.');
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
