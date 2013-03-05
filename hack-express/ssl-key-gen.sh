#!/bin/sh

OPEN_SSL_CMD=openssl
OUTPUT_DIR=./security
KEY_NAME=hack-express-dev.key
CERT_NAME=hack-express-dev.crt
CERT_DAYS=365

mkdir ${OUTPUT_DIR}

openssl genrsa -des3 -out ${OUTPUT_DIR}/server.key

openssl req -new -key ${OUTPUT_DIR}/server.key -out ${OUTPUT_DIR}/server.csr

openssl rsa -in ${OUTPUT_DIR}/server.key -out ${OUTPUT_DIR}/${KEY_NAME}

openssl x509 -req -days ${CERT_DAYS} -in ${OUTPUT_DIR}/server.csr -signkey ${OUTPUT_DIR}/${KEY_NAME} -out ${OUTPUT_DIR}/${CERT_NAME}

rm ${OUTPUT_DIR}/server.key
rm ${OUTPUT_DIR}/server.csr