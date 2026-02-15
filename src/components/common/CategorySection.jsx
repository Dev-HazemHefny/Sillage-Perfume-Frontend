import CategoryCard from './CategoryCard';
import UseCategory from '../../hooks/UseCategory';
import CategoryCardSkeleton from './CategoryCardSkeleton';

const CategorySection = () => {
       let { data, isLoading } = UseCategory();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-5xl font-bold mb-12 text-center">
          Explore Categories
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
           {isLoading===true
            ? Array.from({ length: 6 }).map((_, index) => (
                <CategoryCardSkeleton key={index} />
              ))
            : data?.data?.data.map((category) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  description={category.description}
                  image={category.image}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

export default CategorySection;
