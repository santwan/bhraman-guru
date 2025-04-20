import React from "react";
import { CalendarDays, User } from "lucide-react";

const dummyPosts = [
  {
    title: "Top 5 Hidden Places in Sikkim You Must Visit",
    excerpt:
      "Explore lesser-known destinations in Sikkim that offer peace, beauty, and breathtaking experiences.",
    author: "BhramanGuru Team",
    date: "April 20, 2025",
    coverImage: "https://source.unsplash.com/800x500/?sikkim,mountains",
  },
  {
    title: "How AI is Changing the Way We Travel",
    excerpt:
      "Learn how BhramanGuru uses AI to curate your itinerary, find hotels, and discover local gems.",
    author: "Santwan Pathak",
    date: "April 15, 2025",
    coverImage: "https://source.unsplash.com/800x500/?travel,technology",
  },
  {
    title: "Weekend Getaways from Kolkata",
    excerpt:
      "Planning a short trip from Kolkata? Here are the best destinations under 300 km for a quick escape.",
    author: "BhramanGuru Team",
    date: "April 10, 2025",
    coverImage: "https://source.unsplash.com/800x500/?kolkata,travel",
  },
];

const BlogPage = () => {
  return (
    <div className="bg-white dark:bg-[#0d0d0d]  min-h-screen pt-40 px-5 md:px-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A4D8F] dark:text-yellow-400 mb-4">
            Travel Stories & Tips
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-sm">
            Discover handpicked experiences, hidden destinations, and smart travel tips written by the BhramanGuru team and our community.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {dummyPosts.map((post, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-6 space-y-2">
                <h2 className="text-xl font-semibold text-[#1A4D8F] dark:text-yellow-300">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 pt-3">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={14} />
                    {post.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
