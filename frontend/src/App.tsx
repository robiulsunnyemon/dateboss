import React from 'react';

export function App() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-stone-800">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-stone-900">Project Structure Ready</h1>
        <p className="text-sm text-stone-500">
          সকল প্রিভিয়াস স্ক্রিন ডিলেট করা হয়েছে। আপনি পরবর্তী যে স্ক্রিনটি দিতে চান সেটি দিন, আমি ধাপে ধাপে তৈরি করে দিব।
        </p>
      </div>
    </div>
  );
}

export default App;
