ip=`ifconfig -a | grep "inet " | grep -Fv 127.0.0.1 | awk 'NR==1{print $2}'`
export IP=${ip}
docker-compose up -d && docker exec -it frontend bash
