install: 
	  npm ci

build: 
	  npm run build 

lint:
	  npx eslint .

test:
	  npm test

.PHONY: test
