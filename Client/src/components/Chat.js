import React from 'react'
import '../css/chat.css';

function Chat() {
  return (
    <div>
        <div className="right-container">
            <h2>Messaging</h2>
            <div id="messages-display">
                <h4>Messages:</h4>
                <ul id="messages-list"></ul>
            </div>
            <div className="message-container">
                <input type="text" id="message-input" placeholder="Type your message..."/>
                <button id="send-message">Send</button>
            </div>
        </div>
    </div>
  )
}

export default Chat
