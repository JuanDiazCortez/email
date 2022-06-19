#°/bin/bash 

cd /opt/nodes/richelet/email

rm   /opt/nodes/richelet/email/build -fr
yarn build --verbose
rm -fr  /var/www/localhost/htdocs/build/
mv /opt/nodes/richelet/email/build /var/www/localhost/htdocs
chown apache:apache /var/www/localhost/htdocs/build/
