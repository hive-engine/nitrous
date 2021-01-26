sudo docker build -t registry.heroku.com/scotccc/web .

sudo docker push registry.heroku.com/scotccc/web:latest

heroku container:release web --app scotccc
