import React, { useState } from 'react';
import Layout from '@/components/Layout';

interface Item {
  id: number;
  title: string;
  price: number;
  seller: string;
  image: string;
  description: string;
  category: string;
}

const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Books',
  'Art',
  'Collectibles',
];

const mockItems: Item[] = [
  {
    id: 1,
    title: 'Vintage Camera',
    price: 299.99,
    seller: '0x1234...5678',
    image: '/images/camera.jpg',
    description: 'A beautiful vintage camera in excellent condition.',
    category: 'Electronics',
  },
  {
    id: 2,
    title: 'Designer Watch',
    price: 599.99,
    seller: '0x8765...4321',
    image: '/images/watch.jpg',
    description: 'Luxury designer watch with original box and papers.',
    category: 'Fashion',
  },
  // Add more mock items as needed
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = mockItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Marketplace</h2>
            <button
              type="button"
              className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              List Item
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border-0 py-1.5 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {filteredItems.map((item) => (
              <div key={item.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href="#">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {item.title}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${item.price}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Seller: {item.seller}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 