import React from 'react';
import { Footer, Cart, FooterBanner, HeroBanner, Layout, Navbar, Product } from '../components';
import { client } from '../sanity/lib/client';
import "./globals.css";

const Home = ({ products, bannerData }) => {
    return (
        <>
            <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
            <div className='products-heading'>
                <h2>所有物件</h2>
                <p>懷恩慧倫家的各式好物</p>
            </div>

            <div className='products-container'>
                {products?.map(
                    (product) => <Product key={product._id} product={product} />
                )}
            </div>

            <FooterBanner footerBanner={bannerData && bannerData[0]} />
        </>
    )
}

export const getServerSideProps = async () => {
    const query = '*[_type == "product" && inventory > 0]';
    const products = await client.fetch(query);

    const bannerQuery = '*[_type == "banner"]';
    const bannerData = await client.fetch(bannerQuery);

    return {
        props: { products, bannerData }
    }
}

export default Home
