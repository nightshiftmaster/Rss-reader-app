install: install-deps

lint:
	  npx eslint .

install-deps:
	  npm ci

buid: 
	  npm build [<package-folder>]