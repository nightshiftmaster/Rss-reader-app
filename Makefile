install: 
	  npm ci

build: 
	  npm run build 

lint:
	  npx eslint .

test:
	  NODE_OPTIONS=--experimental-vm-modules npx jest

.PHONY: test
