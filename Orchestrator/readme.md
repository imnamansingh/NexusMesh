# notes

## js style

type: module for import syntax
type: commonjs for require syntax

## mongoose

in mongoose, unlike migration commands in prisma, the collection of documents gets created when you create first ever entry in that collection using mongoose.create by importing the model.

## authentication

Users: authenticate by signing a nonce with their wallet.
Nodes: authenticate the same way, but require that the wallet is registered in NexusMeshLedger.
Ledger service: use a private service key or secure service credential; users should never call settlement endpoints directly.

## metamask

it is an eth wallet application and you can download it either from browser extension store or its official website and you can connect to it via window.etherium in nodejs
if you are running a hardhat node you can connext it to the metamask app by configuring a custom network in metamask app

## session and passport.js

session is a package that is used for statefull behaviour of server. It is used track data accross multiple http requests. It works by generating a session id(when first time the session is created using req.session) and then sending it with a cookie to the browser and in any further requests from the frontend, session intercept the cookie and extract the session id, get the session object stored in memory(by default) by matching the session id and then attach that object in req.session.

passport is a package that is used to authorize requests once the user has been successfully loggin. It authorize the request and then attach user data object to the request in req.user field. It also manages the cookies for session management with the help of session package.
It is equivalent to a custom authentication middleware that intercepts the request, authorize it and attach user object to the req and manual management of session cookies which include access and refresh tokens.

## JWT

JWT is a bearer token that means the one who bears it is authenticated. JWT is a library which is used to sign and create tokens like access tokens and refresh tokens.

Access tokens are short lived while refresh tokens are long lived. Refresh tokens are stored in db because when user's access token get expired, instead of login again with their credentials they simply hit a route and if their refresh token is still alive and get matched with the refresh token stored in db, they will be issued a new access token. User's borwser stores both the tokens.

Only access token is used for authentication and refresh tokens are used for reissuing the access tokens.

## gRPC

first you have to run this command to install required packages from the cwd

npm install @grpc/grpc-js @bufbuild/protobuf
npm install -D @bufbuild/protoc-gen-es @connectrpc/protoc-gen-connect-es
npm install @connectrpc/connect@1.7.0 @connectrpc/connect-node@1.7.0 @bufbuild/protobuf@^1.10.1

then you have to run this command to generate files (but before generating the files, create a generated directory inside the src folder of cwd)

npx protoc \
  --es_out ./src/generated \
  --es_opt target=js \
  --connect-es_out ./src/generated \
  --connect-es_opt target=js \
  --proto_path ../packages/proto \
  ../packages/proto/mesh.proto

if there is no protoc installed, it will give you a prompt to install protoc in global cache of nodejs

you will get two generated files
mesh_pb.js for messages and data structures created by @bufbuild/protoc-gen-es
mesh_connect.js for services created by @connectrpc/protoc-gen-connect-es

connect pacakge generates file that handles services and it also provide runtime funcitons to invoke those services like a function (example  of runtime functions are: reateGrpcTransport, createPromiseClient, etc.)

## git, github & .gitignore

.gitignore only tells the git to not track file mentioned in gitignore, but suppose if any of the file is already getting tracked by git and then you mention it in gitignore then it will not work because it only works for untracked files. In that scenerio, you first need to stop git from tracking that file with the command
git rm --cached {relative path to the file}
and then only you can mention that file in gitignore to stop git from tracking that file because by default, git tracks all the files present in the directory.

The files that are not tracked by git are not pushed to remote repo on github and if you stop tracking the file in between and push your code to github repo, github will delete those files.

## Fetch API

Fetch API adds an "ok" property to response object that it returns after a call.
