sudo docker build -t registry.heroku.com/scotdpo/web .

sudo docker push registry.heroku.com/scotdpo/web:latest

heroku container:release web --app scotdpo
