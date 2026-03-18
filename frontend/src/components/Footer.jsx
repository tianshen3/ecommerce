import React from 'react'
import { assets } from '../assets/assets.js'

function Footer() {

  return (
    <div>
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">

            <div>
                <img src={assets.cart_icon} className="mb-5 w-32" alt="logo"/>
                <p className="w-full md:w-2/3 text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint incidunt qui consequatur dolor magni repudiandae fuga, reprehenderit deserunt. Tenetur obcaecati cupiditate saepe pariatur laboriosam accusantium nisi mollitia commodi temporibus voluptas!
                </p>
            </div>

            <div>
                <p className="text-xl font-medium mb-5">COMPANY</p>
                <ul className="flex flex-col gap-1 text-gray-600">
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            <div>
                <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                <ul className="flex flex-col gap-1 text-gray-600">
                    <li>+1-221-456-7680</li>
                    <li>contact@silkroute.com</li>
                </ul>
            </div>

        </div>

        <div>
                <hr/>
                <p className="py-5 text-sm text-center">Copyright 2026@silkroute.com - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer
