import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChatMessage, ChatRoom as ChatRoomType } from '@/types/marketplace';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';

interface ChatRoomProps {
  room: ChatRoomType;
  currentUserId: string;
  onSendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  room,
  currentUserId,
  onSendMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback((content: string, type: 'text' | 'image' | 'document' = 'text', metadata?: any) => {
    const newMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      senderId: currentUserId,
      receiverId: room.participants.find(id => id !== currentUserId) || '',
      content,
      type,
      metadata,
    };

    onSendMessage(newMessage);
  }, [currentUserId, room.participants, onSendMessage]);

  // Memoize the chat header
  const chatHeader = useMemo(() => (
    <div className="bg-white border-b border-gray-200 p-4">
      <h2 className="text-lg font-semibold">Chat Room</h2>
      <p className="text-sm text-gray-500">
        {room.participants.length} participants
      </p>
    </div>
  ), [room.participants.length]);

  // Memoize the messages container
  const messagesContainer = useMemo(() => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <ChatMessageList
        messages={messages}
        currentUserId={currentUserId}
      />
      <div ref={messagesEndRef} />
    </div>
  ), [messages, currentUserId]);

  // Memoize the chat input
  const chatInput = useMemo(() => (
    <div className="bg-white border-t border-gray-200 p-4">
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  ), [handleSendMessage]);

  return (
    <div className="flex flex-col h-full">
      {chatHeader}
      {messagesContainer}
      {chatInput}
    </div>
  );
}; 