FROM nginx:stable-alpine

LABEL org.opencontainers.image.authors="lukas.jelonek@computational.bio.uni-giessen.de"
LABEL org.opencontainers.image.url='https://github.com/ag-computational-bio/bakrep-web'
LABEL org.opencontainers.image.documentation='https://github.com/ag-computational-bio/bakrep-web/README.md'
LABEL org.opencontainers.image.title='Bakrep Web Frontend (staging)'
LABEL org.opencontainers.image.description='Web frontend for bakrep'

COPY docker/staging/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/staging/
