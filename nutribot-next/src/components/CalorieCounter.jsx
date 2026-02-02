import React, { useState } from 'react';
import { TrendingUp, Plus, Trash2, Search, Apple, Coffee, Utensils, Pizza } from 'lucide-react';

export default function CalorieCounter() {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFood, setShowAddFood] = useState(false);
  const [customFood, setCustomFood] = useState({ name: '', calories: '', serving: '' });

  // Common foods database
  const foodDatabase = [
    { name: 'Banana', calories: 105, serving: '1 medium (118g)', icon: Apple },
    { name: 'Apple', calories: 95, serving: '1 medium (182g)', icon: Apple },
    { name: 'Chicken Breast', calories: 165, serving: '100g', icon: Utensils },
    { name: 'Brown Rice', calories: 215, serving: '1 cup cooked', icon: Utensils },
    { name: 'Egg', calories: 78, serving: '1 large', icon: Utensils },
    { name: 'Avocado', calories: 234, serving: '1 whole', icon: Apple },
    { name: 'Oatmeal', calories: 150, serving: '1 cup cooked', icon: Coffee },
    { name: 'Greek Yogurt', calories: 100, serving: '170g', icon: Coffee },
    { name: 'Almonds', calories: 164, serving: '28g (23 almonds)', icon: Apple },
    { name: 'Sweet Potato', calories: 112, serving: '1 medium', icon: Apple },
    { name: 'Salmon', calories: 206, serving: '100g', icon: Utensils },
    { name: 'Broccoli', calories: 55, serving: '1 cup', icon: Apple },
    { name: 'Whole Wheat Bread', calories: 69, serving: '1 slice', icon: Coffee },
    { name: 'Pasta', calories: 220, serving: '1 cup cooked', icon: Pizza },
    { name: 'Milk', calories: 103, serving: '1 cup', icon: Coffee },
  ];

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFood = (food) => {
    setFoods([...foods, { ...food, id: Date.now(), quantity: 1 }]);
    setSearchQuery('');
  };

  const addCustomFood = () => {
    if (customFood.name && customFood.calories) {
      setFoods([...foods, {
        id: Date.now(),
        name: customFood.name,
        calories: parseInt(customFood.calories),
        serving: customFood.serving || '1 serving',
        quantity: 1,
        icon: Utensils
      }]);
      setCustomFood({ name: '', calories: '', serving: '' });
      setShowAddFood(false);
    }
  };

  const removeFood = (id) => {
    setFoods(foods.filter(food => food.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    setFoods(foods.map(food =>
      food.id === id ? { ...food, quantity: Math.max(1, newQuantity) } : food
    ));
  };

  const totalCalories = foods.reduce((sum, food) => sum + (food.calories * food.quantity), 0);
  const targetCalories = 2000; // Default target
  const percentageConsumed = Math.min((totalCalories / targetCalories) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">
              Calorie Counter
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your daily calorie intake and reach your fitness goals
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Food Search & Add */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search foods..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowAddFood(!showAddFood)}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Custom
                </button>
              </div>

              {/* Custom Food Form */}
              {showAddFood && (
                <div className="bg-orange-50 rounded-xl p-4 space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Food name"
                    value={customFood.name}
                    onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                    className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Calories"
                      value={customFood.calories}
                      onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
                      className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="text"
                      placeholder="Serving size"
                      value={customFood.serving}
                      onChange={(e) => setCustomFood({ ...customFood, serving: e.target.value })}
                      className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button
                    onClick={addCustomFood}
                    className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Add Food
                  </button>
                </div>
              )}

              {/* Food Search Results */}
              {searchQuery && (
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                  {filteredFoods.map((food, idx) => (
                    <button
                      key={idx}
                      onClick={() => addFood(food)}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                    >
                      <food.icon className="w-8 h-8 text-orange-500" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{food.name}</p>
                        <p className="text-sm text-gray-500">{food.serving}</p>
                      </div>
                      <p className="font-bold text-orange-600">{food.calories} cal</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Added Foods List */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Foods</h3>
              {foods.length === 0 ? (
                <div className="text-center py-12">
                  <Pizza className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No foods added yet. Start tracking!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {foods.map((food) => (
                    <div key={food.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <food.icon className="w-8 h-8 text-orange-500" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{food.name}</p>
                        <p className="text-sm text-gray-500">{food.serving}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={food.quantity}
                          onChange={(e) => updateQuantity(food.id, parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 border-2 border-gray-200 rounded-lg text-center font-semibold"
                          min="1"
                        />
                        <p className="font-bold text-orange-600 w-20 text-right">
                          {food.calories * food.quantity} cal
                        </p>
                        <button
                          onClick={() => removeFood(food.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Daily Summary */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-white/80 font-semibold mb-2">Total Calories</p>
              <p className="text-5xl font-black mb-6">{totalCalories}</p>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Daily Goal</span>
                  <span className="font-bold">{targetCalories} cal</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentageConsumed}%` }}
                  ></div>
                </div>
                <p className="text-xs text-white/80 mt-2">
                  {targetCalories - totalCalories > 0
                    ? `${targetCalories - totalCalories} cal remaining`
                    : `${totalCalories - targetCalories} cal over limit`}
                </p>
              </div>

              <div className="text-sm text-white/80">
                <p className="mb-1">Daily target: {targetCalories} calories</p>
                <p>Progress: {percentageConsumed.toFixed(0)}%</p>
              </div>
            </div>

            {/* Macro Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Recommended Breakdown</h3>
              <div className="space-y-3">
                <MacroBar label="Protein" percentage={30} color="bg-blue-500" />
                <MacroBar label="Carbs" percentage={40} color="bg-orange-500" />
                <MacroBar label="Fats" percentage={30} color="bg-yellow-500" />
              </div>
            </div>

            {/* Tips */}
            <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-6">
              <h3 className="font-bold text-teal-900 mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-teal-800">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>Track everything you eat and drink</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>Measure portions accurately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>Stay consistent with tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacroBar({ label, percentage, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="text-gray-500">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`${color} h-full rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
