FROM scratch

COPY start-server.sh /

RUN chmod +x /start-server.sh

ENTRYPOINT ["/start-server.sh"]