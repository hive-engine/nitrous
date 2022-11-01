sudo docker build -t registry.heroku.com/eonhetest/web .

sudo docker push registry.heroku.com/eonhetest/web:latest

heroku container:release web --app eonhetest
