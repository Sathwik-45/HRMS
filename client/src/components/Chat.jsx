import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "tailwindcss";

import user1 from '../assets/user1.jpg';
import user2 from '../assets/user2.jpg';
import user3 from '../assets/user3.png';
import user4 from '../assets/user4.jpeg';

const users = [
  { id: 1, name: 'Josh Cummins', avatar: user4, isGroup: false },
  { id: 2, name: 'Ben Jamin Lee', avatar: user1, isGroup: false },
  { id: 3, name: 'Team Devs', avatar: user3, isGroup: true }
];

const myAvatar = user2;

const initialMessages = {
  1: [{ sender: 'Josh Cummins', text: 'Hey there!' }],
  2: [{ sender: 'Ben Jamin Lee', text: 'Are you coming for lunch?' }],
  3: [
    { sender: 'Sam', text: 'Shared a file!' },
    { sender: 'Priya', text: 'Nice work!' },
    { sender: 'You', text: 'Thanks!' }
  ]
};

export default function ChatSystem() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const sendMessage = () => {
    if (input.trim() === '') return;
    const newMessage = { sender: 'You', text: input };
    setMessages({
      ...messages,
      [selectedUser.id]: [...(messages[selectedUser.id] || []), newMessage]
    });
    setInput('');
  };

  const handleFileUpload = (file) => {
    const fileMessage = {
      sender: 'You',
      text: `${file.name}`
    };
    setMessages({
      ...messages,
      [selectedUser.id]: [...(messages[selectedUser.id] || []), fileMessage]
    });
  };

  return (
    <div className="flex h-[90vh] border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
      {/* Sidebar */}
      <div className="w-[270px] border-r border-gray-200 bg-gray-50 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Messages</h3>
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded hover:bg-gray-200 text-gray-600"
            >
              <i className="fa fa-bars text-lg" />
            </button>
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded z-10">
                <ul className="text-sm">
                  {['Unread Chats', 'Contacts', 'Groups', 'Drafts', 'Non-contacts'].map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => alert(`Filter selected: ${item}`)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <ul className="space-y-2 overflow-y-auto">
          {users.map((user) => (
            <li
              key={user.id}
              className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all ${
                selectedUser.id === user.id
                  ? 'bg-cyan-500 text-white'
                  : 'hover:bg-cyan-100 text-gray-800'
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-medium">{user.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col p-6">
        {/* Chat Header */}
        <div className="flex items-center gap-4 border-b pb-4 mb-5">
          <img
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
            <button className="text-sm text-cyan-600 hover:underline">
              View Profile
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto border border-gray-100 p-5 mb-5 rounded-md bg-gray-50 space-y-4">
          {(messages[selectedUser.id] || []).map((msg, index) => {
            const isYou = msg.sender === 'You';
            const isGroup = selectedUser.isGroup;

            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  isYou ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Group Avatar for incoming msg */}
                {!isYou && isGroup && (
                  <img
                    src={selectedUser.avatar}
                    alt="sender"
                    className="w-8 h-8 rounded-full object-cover mt-1"
                  />
                )}

                <div
                  className={`px-4 py-2 rounded-lg max-w-[70%] shadow-sm ${
                    isYou
                      ? 'bg-cyan-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {!isYou && isGroup && (
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {msg.sender}
                    </div>
                  )}
                  {msg.text}
                </div>

                {/* Your avatar on the right */}
                {isYou && (
                  <img
                    src={myAvatar}
                    alt="You"
                    className="w-8 h-8 rounded-full object-cover mt-1"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="flex items-center gap-3 p-3 border rounded-md bg-gray-100">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-3 rounded-md border border-gray-300 bg-white text-gray-700 outline-none"
          />

          <label className="text-xl text-gray-600 hover:text-cyan-500 cursor-pointer">
            <i className="fa fa-paperclip" />
            <input
              type="file"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              className="hidden"
            />
          </label>

          <button
            onClick={sendMessage}
            className="p-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
          >
            <i className="fa fa-arrow-circle-right text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
