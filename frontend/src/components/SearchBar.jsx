import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext.jsx'
import { assets } from '../assets/assets.js';

function SearchBar() {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    return showSearch ? (
        <div className="border-t border-b bg-gray-50 text-center py-4">
            <div className=" inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 outline-none bg-inherit text-sm" type="text" placeHolder="Search" />
                <img className="w-4" src={assets.cart_icon} alt="search_icon" />
            </div>
            <img onClick={() => setShowSearch(false)} className="inline w-3 cursor-pointer" src={assets.cart_icon} alt="cross_icon" />
        </div>
    ) : null;
}

export default SearchBar