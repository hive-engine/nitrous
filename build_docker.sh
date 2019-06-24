docker rmi `docker images -q`
docker build -t="myname/condenser:mybranch" .
docker run -it -p 8080:8080 myname/condenser:mybranch
