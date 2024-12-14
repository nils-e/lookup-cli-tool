# lookup-cli

## Description

This command-line tool looks up a specified field for a given name in a YAML file.

## Requirements

1. **Script Name**: `lookup-cli`
2. **Input Parameters**:
   - `<name>`: The name to lookup in the YAML file.
   - `<output_field>`: The field to return for the given name (e.g., `age`, `occupation`).
3. **Output**:
   - If both `<name>` and `<output_field>` are provided and valid, return the value of the `<output_field>` for the given `<name>`.
   - If `<name>` is not found, display a message: `Name not found`.
   - If `<output_field>` is not found for the given `<name>`, display a message: `Field not found`.
   - If input is missing, display a user manual for this CLI.

## Example Usage

```bash
$ lookup-cli Alice age
18

$ lookup-cli Bob occupation
unemployed

$ lookup-cli Charlie occupation
Field 'occupation' not found for 'Charlie'. Available fields: 'name', 'age'.

$ lookup-cli Eve age
Name not found

$ lookup-cli
Usage: lookup-cli <name> <output_field>
```

## Setting up Node.js version

This project uses `nvm` (Node Version Manager) to manage Node.js versions. To set the correct Node.js version for this project, follow these steps:

1. Install `nvm` by following the instructions on the nvm GitHub repository.
2. Navigate to the root of the project directory.
3. Run the following command to use the Node.js version specified in the `.nvmrc` file:
   ```
   nvm use
   ```

## Running the script

To run the `lookup-cli` script, follow these steps:

1. Install the project dependencies:
   ```
   npm install
   ```

2. Run the script with the required parameters:
   ```
   node lookup-cli.js <name> <output_field>
   ```

Replace `<name>` and `<output_field>` with the appropriate values.

## Running the script in a Docker container

To run the `lookup-cli` script in a Docker container, follow these steps:

1. Build the Docker image:
   ```
   docker build -t lookup-cli .
   ```

2. Run the Docker container:
   ```
   docker run --rm -v $(pwd):/usr/src/app lookup-cli <name> <output_field>
   ```

Replace `<name>` and `<output_field>` with the appropriate values.
