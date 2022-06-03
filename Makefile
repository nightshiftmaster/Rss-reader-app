install: 
	  npm ci

build: 
	  npm run build 

lint:
	  npx eslint .

test:
	  npm test

test-coverage:
	  npm test -- --coverage --coverageProvider=v8
