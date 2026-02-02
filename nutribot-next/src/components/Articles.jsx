import React from 'react';
import { BookOpen, Clock, ArrowLeft, Heart, Zap, Apple, Target, Coffee } from 'lucide-react';

export default function Articles() {
  const articles = [
    {
      id: 1,
      title: 'Complete Guide to Healthy Eating for Beginners',
      excerpt: 'Learn the fundamentals of nutrition, balanced meals, and sustainable eating habits.',
      category: 'Nutrition Basics',
      readTime: '8 min',
      icon: Apple,
      color: 'from-green-500 to-emerald-500',
      url: 'https://www.healthline.com/nutrition/how-to-eat-healthy'
    },
    {
      id: 2,
      title: 'High-Protein Foods for Muscle Building',
      excerpt: 'Discover the best protein sources to support muscle growth and recovery.',
      category: 'Fitness Nutrition',
      readTime: '6 min',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      url: 'https://www.healthline.com/nutrition/high-protein-foods'
    },
    {
      id: 3,
      title: "Intermittent Fasting: Beginner's Guide",
      excerpt: 'Explore popular fasting methods, benefits, and how to start safely.',
      category: 'Diet Methods',
      readTime: '10 min',
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      url: 'https://www.healthline.com/nutrition/intermittent-fasting-guide'
    },
    {
      id: 4,
      title: 'Counting Calories: The Complete Guide',
      excerpt: 'Learn how calorie counting works and how to calculate your daily needs.',
      category: 'Weight Management',
      readTime: '7 min',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      url: 'https://www.healthline.com/nutrition/calorie-counting'
    },
    {
      id: 5,
      title: 'Meal Prep Mastery: Weekly Planning Guide',
      excerpt: 'Save time and eat healthier with effective meal prep strategies.',
      category: 'Meal Planning',
      readTime: '9 min',
      icon: Coffee,
      color: 'from-teal-500 to-emerald-500',
      url: 'https://www.healthline.com/nutrition/meal-prep-guide'
    },
    {
      id: 6,
      title: 'Understanding Macros: The Complete Guide',
      excerpt: 'Understand protein, carbs, and fats and how to balance them properly.',
      category: 'Nutrition Science',
      readTime: '11 min',
      icon: Heart,
      color: 'from-rose-500 to-pink-500',
      url: 'https://www.verywellfit.com/what-are-macros-2242001'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">
              Diet & Nutrition Articles
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Curated, evidence-based articles from trusted health sources
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => {
            const Icon = article.icon;
            return (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group text-left border border-gray-100"
              >
                <div className={`h-48 bg-gradient-to-br ${article.color} relative`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
                  <div className="absolute bottom-6 left-6">
                    <Icon className="w-16 h-16 text-white" />
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                      {article.category}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {article.excerpt}
                  </p>

                  <div className="text-purple-600 font-bold flex items-center gap-2">
                    Read Original Article
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
