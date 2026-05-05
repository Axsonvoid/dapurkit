import { useCart } from '../context/CartContext';
import { meals } from '../data/mockMeals';

export default function Home() {
  const { addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Meal kits made <span className="text-green-600">easy</span>.
        </h1>
        <p className="text-lg text-gray-500">Fresh ingredients, chef-designed recipes, delivered to your door.</p>
      </div>

      {/* Meal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {meals.map((meal) => (
          <div key={meal.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100">
            <img src={meal.image} alt={meal.name} className="w-full h-48 object-cover" />
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">{meal.name}</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{meal.calories} kcal</span>
              </div>
              <p className="text-gray-500 text-sm mb-4 h-10">{meal.desc}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-bold text-gray-900">Rp {meal.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(meal)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}