package com.realTimeChatApp.springChatAPP.chat;

import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
}
