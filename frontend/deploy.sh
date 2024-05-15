
set -e

npm run build

cd dist


git init
git checkout -B main
git add -A
git commit -m 'deploy'


cd -
