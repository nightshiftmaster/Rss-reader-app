install: install-deps

lint:
	  npx eslint .

install-deps:
	  npm ci

buid: 
	  npm run-script build