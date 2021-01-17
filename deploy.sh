sudo docker build -t registry.heroku.com/neoxag/web .

sudo docker push registry.heroku.com/neoxag/web:latest

heroku container:release web --app neoxag
