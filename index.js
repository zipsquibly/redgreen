var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
      res.sendfile('rg.html');
});

io.on('connection', function(socket){
      console.log('a user connected');
      setTimeout(function() {
          socket.on('syncback', function(msg) {
              if (msg.inc < 100) {
                 sendTime(socket, msg);
              } else {
                  socket.emit('calcOffset', {
                      time : Date.now()
                  });
                  setTimeout(function() {
                      socket.emit('setClock', {
                          time: Date.now()
                      })
                  }, 500);
              }
          });
          sendTime(socket, { inc: 1 });
      }, 1000);
});

function sendTime(socket, msg) {
    socket.emit('sync', {
        inc : msg.inc + 1,
        time : Date.now()
    });
}

http.listen(9090, function(){
      console.log('listening on *:9090');
});
