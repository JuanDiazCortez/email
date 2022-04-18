#! /bin/bash

 ip=$(ifconfig | grep 192.168.1.27 | awk '{ print $2 }')
 echo "$ip"

 if [[ -n $ip ]];
   then
     echo "es Richelet"
     path="/opt/richelet/richelet-info/node_modules/node-poplib-yapc"
  fi

ip2=$(ifconfig | grep 192.168.0.120 | awk '{ print $2 }')
echo "$ip2"
if [[ -n $ip2 ]];
then
     echo "es Juan"
     path="/opt/nodes/richelet/richelet-info/node_modules/node-poplib-yapc"
 
fi
echo "$path"
cp ./package.json $path
cp ./index.js $path
cd $path
yarn 


