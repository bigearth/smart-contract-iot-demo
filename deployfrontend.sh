rsync -r build_webpack/ docs/
rsync build/contracts/ docs/
git add .
git commit -m 'build'
git push origin master
