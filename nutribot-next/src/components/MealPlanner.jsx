import React, { useState } from 'react';
import { Calendar, Plus, X, Clock, Flame, ShoppingCart, CheckCircle } from 'lucide-react';

export default function MealPlanner() {
  const [selectedDay, setSelectedDay] = useState(null);

  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: '', type: 'breakfast', calories: '', time: '' });

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'bg-orange-100 text-orange-700' },
    { value: 'lunch', label: 'Lunch', icon: '☀️', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'dinner', label: 'Dinner', icon: '🌙', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'snack', label: 'Snack', icon: '🍎', color: 'bg-green-100 text-green-700' }
  ];

  // Sample meals for demonstration
  const sampleMeals = {
    'MON-breakfast': { name: 'Oatmeal Bowl', calories: 320, time: '07:30' },
    'MON-lunch': { name: 'Grilled Chicken Salad', calories: 450, time: '12:30' },
    'TUE-breakfast': { name: 'Scrambled Eggs & Toast', calories: 380, time: '07:30' },
    'WED-breakfast': { name: 'Smoothie Bowl', calories: 290, time: '08:00' },
    'WED-lunch': { name: 'Quinoa Buddha Bowl', calories: 520, time: '13:00' },
    'THU-dinner': { name: 'Salmon with Veggies', calories: 580, time: '19:00' },
  };

  const [mealsData, setMealsData] = useState(sampleMeals);

  const addMeal = () => {
    if (newMeal.name && selectedDay) {
      const key = `${selectedDay}-${newMeal.type}`;
      setMealsData({
        ...mealsData,
        [key]: {
          name: newMeal.name,
          calories: parseInt(newMeal.calories) || 0,
          time: newMeal.time
        }
      });
      setNewMeal({ name: '', type: 'breakfast', calories: '', time: '' });
      setShowAddMeal(false);
    }
  };

  const removeMeal = (key) => {
    const updated = { ...mealsData };
    delete updated[key];
    setMealsData(updated);
  };

  const getDayMeals = (day) => {
    return mealTypes.map(type => ({
      ...type,
      meal: mealsData[`${day}-${type.value}`]
    }));
  };

  const getTotalCalories = (day) => {
    return Object.entries(mealsData)
      .filter(([key]) => key.startsWith(day))
      .reduce((sum, [, meal]) => sum + (meal.calories || 0), 0);
  };

  const shoppingList = [
    'Chicken breast', 'Quinoa', 'Avocado', 'Salmon',
    'Eggs', 'Spinach', 'Oats', 'Greek yogurt'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">
              Meal Planner
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plan your weekly meals with personalized nutrition insights
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Weekly Meal Calendar</h2>
                <button
                  onClick={() => setShowAddMeal(true)}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Meal
                </button>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-3 mb-6">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`p-3 rounded-xl font-bold text-sm transition-all ${selectedDay === day
                      ? 'bg-teal-500 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Meals for Each Day */}
              <div className="space-y-4">
                {daysOfWeek.map(day => (
                  <div key={day} className="border-2 border-gray-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900">{day}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-gray-600">
                          {getTotalCalories(day)} cal
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {getDayMeals(day).map(({ value, label, icon, color, meal }) => (
                        <div key={value} className="relative group">
                          {meal ? (
                            <div className={`${color} rounded-xl p-3 relative`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold">{icon} {label}</span>
                                <button
                                  onClick={() => removeMeal(`${day}-${value}`)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 rounded"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="font-semibold text-sm truncate">{meal.name}</p>
                              <div className="flex items-center gap-2 mt-2 text-xs">
                                {meal.time && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {meal.time}
                                  </span>
                                )}
                                <span className="font-bold">{meal.calories} cal</span>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedDay(day);
                                setNewMeal({ ...newMeal, type: value });
                                setShowAddMeal(true);
                              }}
                              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-3 hover:border-teal-400 hover:bg-teal-50 transition-colors"
                            >
                              <p className="text-xs text-gray-400">{icon} {label}</p>
                              <p className="text-xs text-gray-400 mt-1">Add meal</p>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nutrition Summary */}
            <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Weekly Summary
              </h3>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span>Total Calories</span>
                  <span className="font-bold">
                    {daysOfWeek.reduce((sum, day) => sum + getTotalCalories(day), 0)} cal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Avg per Day</span>
                  <span className="font-bold">
                    {Math.round(daysOfWeek.reduce((sum, day) => sum + getTotalCalories(day), 0) / 7)} cal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Meals Planned</span>
                  <span className="font-bold">{Object.keys(mealsData).length}</span>
                </div>
              </div>
            </div>

            {/* Shopping List */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-teal-600" />
                Shopping List
              </h3>
              <div className="space-y-2">
                {shoppingList.map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
                    <span className="text-gray-700 group-hover:text-gray-900">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-emerald-900 mb-3">Meal Prep Tips</h3>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Plan meals on Sunday for the week ahead</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Prep ingredients in advance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Use similar ingredients across meals</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Add Meal Modal */}
        {showAddMeal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
              <button
                onClick={() => setShowAddMeal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Meal</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Day</label>
                  <select
                    value={selectedDay || ''}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select day</option>
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type</label>
                  <select
                    value={newMeal.type}
                    onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {mealTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Name</label>
                  <input
                    type="text"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    placeholder="e.g., Greek Yogurt Bowl"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
                    <input
                      type="number"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                      placeholder="350"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={newMeal.time}
                      onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <button
                  onClick={addMeal}
                  className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Add Meal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
