sudo docker build -t registry.heroku.com/scotnobel/web .

sudo docker push registry.heroku.com/scotnobel/web:latest

heroku container:release web --app scotnobel
