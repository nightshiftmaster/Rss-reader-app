install: 
	  npm ci

build: 
	  npm run build 

lint:
	  npx eslint .

push:
	  git add .
	  git commit -m 'update'
	  git push
