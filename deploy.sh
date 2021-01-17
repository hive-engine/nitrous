sudo docker build -t registry.heroku.com/palnet/web .

sudo docker push registry.heroku.com/palnet/web:latest

heroku container:release web --app palnet
