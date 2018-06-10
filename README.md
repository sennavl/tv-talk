# TvTalk

This repo consists of four directories:
- agendaServer
- api
- server
- tvtalk

agendaServer checks every 5 seconds if a chatroom has to be created or if a chatroom needs to be closed. Written in NodeJs.

	npm i
    nodemon server.js

The api is also written in Nodejs. It communicates with a MongoDB database to perform user-interactions such as adding a movie to a list or your favorites.

	npm i
	nodemon server.js

The server makes the communication between clients possible to make chatting possible. Written in NodeJs, using the socket.io library.

	npm i
	nodemon server.js

The frontend is written in Vue. It uses all three previously mentioned projects and also uses an external API (https://www.themoviedb.org/documentation/api).

	npm i
	npm run dev
