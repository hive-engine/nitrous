sudo docker build -t registry.heroku.com/frozen-retreat-15997/web .

sudo docker push registry.heroku.com/frozen-retreat-15997/web:latest

heroku container:release web --app frozen-retreat-15997
