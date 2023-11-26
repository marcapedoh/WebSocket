    'use strict';

    var usernamePage= document.querySelector('#username-page');
    var chatPage= document.querySelector('#chat-page');
    var usernameForm= document.querySelector('#usernameForm');
    var messageForm= document.querySelector('#messageForm');
    var messageInput= document.querySelector('#message');
    var messageArea = document.querySelector('#messageArea');
    var connectingElement = document.querySelector('.connecting')

    var stompClient= null;
    var username = null;

    var colors =[
        '#023047','#1d3557','#14213d','#118ab2','#ef476f','#212529','#03045e',
        '#9c6644','#3d405b','#540b0e','#231942','#003459','#370617','#22333b','#3c1642'
    ];

    function connect(event){
        username = document.querySelector('#name').value.trim();

        if(username){
            usernamePage.classList.add('hidden');
            chatPage.classList.remove('hidden');

            var socket= new SockJS("/ws");
            stompClient= Stomp.over(socket);

            stompClient.connect({}, onConnected,onError);
        }
        event.preventDefault();
    }

    function onConnected(){
        stompClient.subscribe('/topic/public', onMessageReceived);

        stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
        );

        connectingElement.classList.add('hidden');
    }

    function onError(error){
        connectingElement.textContent= 'Could not connect to the chatAPP Server! Refresh the Page and try again !!!';
        connectingElement.style.color= 'red';
    }

    function sendMessage(event){
        var messageContent= messageInput.value.trim();
        if(messageContent && stompClient){
            var chatMessage ={
                sender: username,
                content: messageInput.value,
                type: 'CHAT'
            };
            stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
            messageInput.value='';
            event.preventDefault();
        }
    }

    function onMessageReceived(payload){
        var message= JSON.parse(payload.body);

        var messageElement= document.createElement('li');
        if(message.type=== 'JOIN'){
            messageElement.classList.add('event-message');
            message.content= message.sender + ' joined the chat!';
        }else if(message.type=== 'LEAVE'){
            messageElement.classList.add('event-message');
            message.content= message.sender + ' left the chat!';
        }else{
            messageElement.classList.add('chat-message');

                    var avatarElement = document.createElement('i');
                    var avatarText = document.createTextNode(message.sender[0]);
                    avatarElement.appendChild(avatarText);
                    avatarElement.style['background-color'] = getAvatarColor(message.sender);
                    avatarElement.style['color']= '#fff';
                    messageElement.appendChild(avatarElement);
                    var usernameElement = document.createElement('span');
                    var usernameText = document.createTextNode(message.sender);
                    usernameElement.appendChild(usernameText);
                    messageElement.appendChild(usernameElement);
        }
        var textElement = document.createElement('p');
        var messageText = document.createTextNode(message.content);
        textElement.appendChild(messageText);

             messageElement.appendChild(textElement);

             messageArea.appendChild(messageElement);
             messageArea.scrollTop = messageArea.scrollHeight;
    }

    function getAvatarColor(messageSender) {
                 var hash = 0;
                 for (var i = 0; i < messageSender.length; i++) {
                     hash = 31 * hash + messageSender.charCodeAt(i);
                 }
                 var index = Math.abs(hash % colors.length);
                 return colors[index];
    }

     usernameForm.addEventListener('submit', connect, true)
     messageForm.addEventListener('submit', sendMessage, true)