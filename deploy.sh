sudo docker build -t registry.heroku.com/scotlotus/web .

sudo docker push registry.heroku.com/scotlotus/web:latest

heroku container:release web --app scotlotus
