sudo docker build -t registry.heroku.com/actnearn/web .

sudo docker push registry.heroku.com/actnearn/web:latest

heroku container:release web --app actnearn
