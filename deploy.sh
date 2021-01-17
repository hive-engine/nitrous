sudo docker build -t registry.heroku.com/battlegamesio/web .

sudo docker push registry.heroku.com/battlegamesio/web:latest

heroku container:release web --app battlegamesio
