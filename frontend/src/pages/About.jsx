import React from 'react'
import Title from "../components/Title.jsx";
import {assets} from "../assets/assets.js";
import NewslettlerBox from "../components/NewsletterBox.jsx";

function About() {
  return (
    <div>

      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"}/>
      </div>
      
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className="w-full md:max-w-[450px]" src={assets.about_img} alt=""/>
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>SilkRoute is a modern eCommerce platform inspired by the historic trade routes that connected cultures, ideas, and goods across the world. Just like its namesake, SilkRoute aims to bridge distances by bringing a diverse range of high-quality products right to your doorstep. From everyday essentials to unique finds, we carefully curate our collection to ensure that every customer experiences convenience, variety, and value in one place.</p>
          <p>At SilkRoute, we believe shopping should be more than just a transaction—it should be a journey of discovery. Our team is dedicated to delivering a seamless, secure, and enjoyable experience backed by reliable customer support and fast delivery. With a focus on innovation and customer satisfaction, SilkRoute continues to grow as a trusted destination for shoppers seeking quality, authenticity, and ease.</p>

          <b className="text-gray-800">Our Misson</b>
          <p>At our core, our mission is to make online shopping simple, reliable, and accessible for everyone. We strive to connect customers with high-quality products at fair prices while delivering a seamless and enjoyable shopping experience. 
            By combining innovation, customer-centric service, and a commitment to trust, we aim to empower people to shop with confidence anytime, anywhere. Our goal is not just to sell products, but to build lasting relationships through transparency, 
            convenience, and consistent value.
          </p>
        </div>
      </div>

      <div className="text-4xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"}/>
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">We are committed to maintaining high standards of quality across every product on SilkRoute by working with trusted suppliers, verifying product details, and continuously monitoring customer feedback. Our quality assurance process ensures accuracy, reliability, and consistency so that customers can shop with confidence, knowing they will receive products that meet their expectations.
          </p>          
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">At SilkRoute, convenience is at the heart of everything we do. We aim to make your shopping experience effortless by offering an easy-to-navigate platform, secure payment options, and fast, reliable delivery. From browsing to checkout, every step is designed to save you time and simplify your journey, so you can find what you need quickly and enjoy a smooth, hassle-free experience.
          </p>          
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">At SilkRoute, exceptional customer service is a top priority. We are dedicated to providing prompt, friendly, and reliable support to ensure every customer has a smooth and satisfying experience. Whether it’s answering questions, resolving concerns, or assisting with orders, our team is always ready to help, making sure you feel valued and supported at every step of your shopping journey.
          </p>          
        </div>
      </div>

      <NewslettlerBox/>
    </div>
  )
}

export default About
