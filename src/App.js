// resource = https://youtu.be/Lag9Pj_33hM
// change the apiKey

import React, { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_APIKEY
});

const openai = new OpenAIApi(configuration);

export default function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT",
      sender: "ChatGPT"
    }
  ]);

  const hdlSend = async (msg) => {
    const newMsg = {
      message: msg,
      sender: "user",
      direction: "outgoing"
    };
    const newMsgs = [...messages, newMsg];
    setMessages(newMsgs);
    setTyping(true);
    await sendToChatGPT(newMsgs);
  };

  const sendToChatGPT = async (chatMsgs) => {
    let apiMsgs = chatMsgs.map((msgObj) => {
      let role = msgObj.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: msgObj.message };
    });

    const systemMsg = {
      role: "system",
      // content: "Explain all concept like I am 10 years old."
      content: "Explain all concept like I am an 10 years web-developer"
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMsg, ...apiMsgs]
    };

    const completion = await openai.createChatCompletion(apiRequestBody);
    // console.log(completion.data.choices[0].message);
    let newMsg = completion.data.choices[0].message.content;
    console.log(newMsg);
    setMessages([...chatMsgs, { message: newMsg, sender: "ChatGPT" }]);
    setTyping(false);
  };

  return (
    <div style={{ padding: 16, height: '95vh', display: 'flex', flexFlow:'column'}}>
      <p style={{ width: 800, margin: "auto" }}>Any question...?</p>
      <MainContainer style={{ width: 800, margin: "auto", flexBasis: '90%'}}>
        <ChatContainer style={{ padding: 8 }}>
          <MessageList
            style={{ padding: 8 }}
            typingIndicator={
              typing ? (
                <TypingIndicator
                  style={{ margin: 4, opacity: 0.5 }}
                  content="ChatGPT is typing"
                />
              ) : null
            }
          >
            {messages.map((msg, i) => {
              return <Message key={i} model={msg} style={{ marginBlock: 8 }} />;
            })}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={hdlSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
