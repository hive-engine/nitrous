sudo docker build -t registry.heroku.com/scotbpc/web .

sudo docker push registry.heroku.com/scotbpc/web:latest

heroku container:release web --app scotbpc
