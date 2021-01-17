sudo docker build -t registry.heroku.com/splintertalk/web .

sudo docker push registry.heroku.com/splintertalk/web:latest

heroku container:release web --app splintertalk
