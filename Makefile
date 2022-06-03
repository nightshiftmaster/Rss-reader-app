install: 
	  npm ci

build: 
	  npm run build --if-present

lint:
	  npx eslint .

test:
	  npm run test