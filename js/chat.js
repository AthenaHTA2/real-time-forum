var User = false;
var UserList

window.onload = function () {
    var conn;
    var msg = document.getElementById("msg");
    var log = document.getElementById("log");
    var usersLog = document.getElementById("usersLog");

    function appendLog(item) {
        var doScroll = log.scrollTop > log.scrollHeight - log.clientHeight - 1;
        log.appendChild(item);
        if (doScroll) {
            log.scrollTop = log.scrollHeight - log.clientHeight;
        }
    }

    function AppendUser(item) {

        var doScroll = usersLog.scrollTop > usersLog.scrollHeight - usersLog.clientHeight - 1;
        usersLog.appendChild(item);
        if (doScroll) {
            usersLog.scrollTop = usersLog.scrollHeight - usersLog.clientHeight;
        }
    
}

    document.getElementById("formChat").onsubmit = function () {
        if (!conn) {
            return false;
        }
        if (!msg.value) {
            return false;
        }
        conn.send(msg.value);
        msg.value = "";
        return false;
    };

    if (window["WebSocket"]) {
        conn = new WebSocket("ws://" + document.location.host + "/ws");
        conn.onclose = function (evt) {
            var item = document.createElement("div");
            item.innerHTML = "<b>Connection closed.</b>";
            appendLog(item);
        };
        conn.onmessage = function (evt) {
            var messages = evt.data.split('\n');
            if(string(messages[0])== "UsersList"){
                UserList = messages.slice(1)
                User = true;
                
            }
            for (var i = 0; i < messages.length; i++) {
                var item = document.createElement("div");
                
                if(User){
                    item.style.color = 'white'
                    item.innerText = UserList[i];
                    AppendUser(item);
                }else{
                    console.log("not User", messages)
                    item.innerText = messages[i];
                    item.style.color = '#80ed99'
                    appendLog(item);
                }
               
            }
        };

        /*conn.onopen = function() { 
            conn.onmessage = function (evt) {
            var messages = evt.data.split('\n');
            for (var i = 0; i < messages.length; i++) {
                var item = document.createElement("div");
                item.style.color = '#80ed99'
                item.innerText = messages[i];
                AppendUser(item);
            }
        };
            for ( let usr = 0; usr < regUsers.length; usr++){
            usersLog.append(
                '<div class="user-container">' +
                '<p class="userNickName">' + String.fromCharCode(...regUsers[usr]) + '</p>' +
                '</div>'
                );
        }
}*/;

    } else {
        var item = document.createElement("div");
        item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
        appendLog(item);
    }
};