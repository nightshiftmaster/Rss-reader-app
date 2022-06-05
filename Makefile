develop:
	  npx webpack serve

install: 
	  npm ci

start:
	  npx webpack

build:
	  rm -rf dist
	  NODE_ENV=production npx webpack

lint:
	  npx eslint .

test:
	  npm run test
