sudo docker build -t registry.heroku.com/scotbuild/web .

sudo docker push registry.heroku.com/scotbuild/web:latest

heroku container:release web --app scotbuild
