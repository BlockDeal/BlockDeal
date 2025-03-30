import React from 'react';
import { ChatMessage } from '@/types/marketplace';
import Image from 'next/image';

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentUserId,
}) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.senderId === currentUserId;

        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                isCurrentUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {/* Message Content */}
              {message.type === 'text' && (
                <p className="text-sm">{message.content}</p>
              )}

              {/* Image Message */}
              {message.type === 'image' && message.metadata?.fileUrl && (
                <div className="relative w-64 h-64">
                  <Image
                    src={message.metadata.fileUrl}
                    alt="Shared image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              )}

              {/* Document Message */}
              {message.type === 'document' && message.metadata && (
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">
                      {message.metadata.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(message.metadata.fileSize / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <p
                className={`text-xs mt-1 ${
                  isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 