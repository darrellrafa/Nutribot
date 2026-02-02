import React, { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';

export default function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const calculateBMI = (e) => {
    e.preventDefault();

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // convert cm to meters

    if (weightNum > 0 && heightNum > 0) {
      const bmiValue = (weightNum / (heightNum * heightNum)).toFixed(1);
      setBmi(bmiValue);

      // Determine category
      let cat = '';
      let recs = [];

      if (bmiValue < 18.5) {
        cat = 'Underweight';
        recs = [
          'Increase calorie intake with nutrient-dense foods',
          'Include more protein-rich foods in your diet',
          'Consider strength training exercises',
          'Consult with a nutritionist for a personalized meal plan'
        ];
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        cat = 'Normal Weight';
        recs = [
          'Maintain your current healthy eating habits',
          'Continue regular physical activity',
          'Stay hydrated with 8-10 glasses of water daily',
          'Get adequate sleep (7-9 hours per night)'
        ];
      } else if (bmiValue >= 25 && bmiValue < 30) {
        cat = 'Overweight';
        recs = [
          'Create a moderate calorie deficit (300-500 cal/day)',
          'Increase physical activity to 150+ minutes per week',
          'Focus on whole foods and reduce processed foods',
          'Practice portion control and mindful eating'
        ];
      } else {
        cat = 'Obese';
        recs = [
          'Consult with a healthcare provider for personalized advice',
          'Start with gradual lifestyle changes',
          'Consider working with a registered dietitian',
          'Aim for sustainable weight loss of 0.5-1 kg per week'
        ];
      }

      setCategory(cat);
      setRecommendations(recs);
    }
  };

  const getCategoryColor = () => {
    if (!category) return 'from-gray-400 to-gray-500';
    if (category === 'Underweight') return 'from-blue-400 to-cyan-500';
    if (category === 'Normal Weight') return 'from-teal-400 to-emerald-500';
    if (category === 'Overweight') return 'from-orange-400 to-amber-500';
    return 'from-red-400 to-rose-500';
  };

  const getCategoryIcon = () => {
    if (category === 'Underweight') return TrendingDown;
    if (category === 'Normal Weight') return Activity;
    if (category === 'Overweight' || category === 'Obese') return TrendingUp;
    return AlertCircle;
  };

  const CategoryIcon = getCategoryIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Calculator className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">
              BMI Calculator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your Body Mass Index and get personalized health recommendations
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <form onSubmit={calculateBMI} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="70"
                  required
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="170"
                  required
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
            >
              Calculate BMI
            </button>
          </form>
        </div>

        {/* Results */}
        {bmi && (
          <div className="space-y-6">
            {/* BMI Result Card */}
            <div className={`bg-gradient-to-br ${getCategoryColor()} rounded-3xl p-8 text-white shadow-xl`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/80 font-semibold mb-2">Your BMI</p>
                  <p className="text-6xl font-black">{bmi}</p>
                </div>
                <CategoryIcon className="w-20 h-20 text-white/30" />
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
                <CategoryIcon className="w-6 h-6" />
                <span className="font-bold text-lg">{category}</span>
              </div>
            </div>

            {/* BMI Scale */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">BMI Scale</h3>
              <div className="space-y-3">
                <ScaleItem range="< 18.5" category="Underweight" color="bg-blue-500" current={parseFloat(bmi) < 18.5} />
                <ScaleItem range="18.5 - 24.9" category="Normal Weight" color="bg-teal-500" current={parseFloat(bmi) >= 18.5 && parseFloat(bmi) < 25} />
                <ScaleItem range="25 - 29.9" category="Overweight" color="bg-orange-500" current={parseFloat(bmi) >= 25 && parseFloat(bmi) < 30} />
                <ScaleItem range="≥ 30" category="Obese" color="bg-red-500" current={parseFloat(bmi) >= 30} />
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommendations</h3>
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-teal-600 font-bold text-sm">{idx + 1}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900 mb-2">Important Note</p>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    BMI is a screening tool and doesn't directly measure body fat. It may not be accurate for athletes,
                    elderly, or pregnant women. Always consult with a healthcare provider for personalized advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScaleItem({ range, category, color, current }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${current ? 'bg-gray-100 ring-2 ring-teal-500' : 'bg-gray-50'
      }`}>
      <div className={`w-4 h-4 ${color} rounded-full ${current ? 'ring-4 ring-offset-2 ring-teal-300' : ''}`}></div>
      <div className="flex-1">
        <p className={`font-bold ${current ? 'text-gray-900' : 'text-gray-700'}`}>{category}</p>
        <p className="text-sm text-gray-500">BMI {range}</p>
      </div>
      {current && (
        <div className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">
          You are here
        </div>
      )}
    </div>
  );
}
