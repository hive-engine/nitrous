sudo docker build -t registry.heroku.com/lieta/web .

sudo docker push registry.heroku.com/lieta/web:latest

heroku container:release web --app lieta
