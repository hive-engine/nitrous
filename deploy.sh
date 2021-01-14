sudo docker build -t registry.heroku.com/sportstalksocial/web .

sudo docker push registry.heroku.com/sportstalksocial/web:latest

heroku container:release web --app sportstalksocial
