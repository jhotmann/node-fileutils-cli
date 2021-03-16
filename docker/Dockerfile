FROM node:15-alpine

VOLUME [ "/workingdir" ]

RUN npm i -g fileutils-cli

WORKDIR /workingdir
ENTRYPOINT ["fu"]
CMD ["--help"]