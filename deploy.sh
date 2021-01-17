sudo docker build -t registry.heroku.com/scotsand/web .

sudo docker push registry.heroku.com/scotsand/web:latest

heroku container:release web --app scotsand
