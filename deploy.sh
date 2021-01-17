sudo docker build -t registry.heroku.com/reggaesteem/web .

sudo docker push registry.heroku.com/reggaesteem/web:latest

heroku container:release web --app reggaesteem
