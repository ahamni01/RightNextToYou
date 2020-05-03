# RightNextToYou
Right Next To You Media Platform

### SetUp
#### Initialize
npm init
npm i -D typescript ts-node nodemon @types/express @types/socket.io
npm i express socket.io 

#### Add Scripts:
"start": "ts-node src/index.ts",
"dev": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts"

#### Other configs for Windows
tsconfig.json
nodemon.json

#### Troubleshooting:
''ts-node'' is not recognized as an internal or external command": for windows \"ts-node\"

#### Run in DEV mode
npm run dev
