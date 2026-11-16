# commands & notes

## initializing the hardhat project

npx hardhat init

## running hardhat node on isolated terminal

npx hardhat node ( but run it inside the directory in which hardhat is installed and configured ie Contracts in this case)

## running deployment and distribution script on project terminal

npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/distribute.js --network localhost

## url package

this is a native js package like path and it is used for parsing, constructing, and manipulating URLs.

fileURLToPath is a specific fn that converts a file URL string or object into an absolute path (OS Specific)

import.meta.url is a built-in ES Module property that returns the absolute file URL of the current executing file.

path.dirname() is a fn that takes a file path and remove the file name from last to give back the absolute path to the parent directory of current executing file.

path.resolve() is a function that resolves an absolute path from the sequence of paths.You can use process.cwd() and then relative path from it to any folder to generate the absolute path of that folder with the help of path.resolve.
