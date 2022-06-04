install: 
	  npm ci

build: 
	  npm run build 

lint:
	  npx eslint .

test:
	  npx jest

.PHONY: test
