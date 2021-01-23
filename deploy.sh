sudo docker build -t registry.heroku.com/lassecash/web .

sudo docker push registry.heroku.com/lassecash/web:latest

heroku container:release web --app lassecash
