import React, { useContext, useEffect, useState } from 'react';
import {ShopContext} from "../context/ShopContext.jsx";
import Title from './Title.jsx';
import ProductItem from './ProductItem.jsx';

function LatestCollection() {
    
    const {products} = useContext(ShopContext);
    
    const [latestProducts, setLatestProducts] = useState([]);

    //executed once when the component mounts
    useEffect(() => {
        setLatestProducts(products.slice(0,10));
    },[]);

  
  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"}/>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum, alias cumque eaque numquam, consectetur in minima nam dolorem doloremque, adipisci blanditiis saepe autem. Neque, veniam consequatur quaerat enim provident est!
          Nam ab, ut architecto consequuntur tempore culpa ullam ducimus magni, minus quaerat quae quidem aperiam dolorem beatae. Fugit esse at pariatur qui atque, aut, accusamus officiis modi, nesciunt hic ipsam.
        </p>
      </div>

      {/* Render all the products  */}
      <div className="grid gird-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {
          latestProducts.map((item, index) => (
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
          ))
        }
      </div>
    </div>
  )
}

export default LatestCollection;
