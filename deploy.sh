sudo docker build -t registry.heroku.com/bloque64/web .

sudo docker push registry.heroku.com/bloque64/web:latest

heroku container:release web --app bloque64
