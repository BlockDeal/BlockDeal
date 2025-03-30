export interface Seller {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  totalTransactions: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  location: string;
  imageUrl: string;
  seller: Seller;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'sold' | 'cancelled';
}

export interface ListingFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  location?: string;
  status?: 'active' | 'sold' | 'cancelled';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'document';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
  };
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'archived';
} 