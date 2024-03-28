import React, { useState } from 'react';
import { urlFor, client } from '../../sanity/lib/client';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext'
import { BuyNowPage } from '../../components';


const ProductDetails = ({ product, products }) => {
    const { image, name, details, price, inventory, star, sellerExperience } = product;
    const [index, setIndex] = useState(0);
    const {
        incQty,
        decQty,
        qty,
        onAdd,
        buyNowPage,
        toggleStartBuyingPage,
        updateInventoryAndCreateOrder,
        isLoading } = useStateContext();
    const totalStar = 5;
    return (
        <div>
            <div className='product-detail-container'>
                <div>
                    <div className='image-container'>
                        <img
                            src={urlFor(image && image[index])}
                            className="product-detail-image" />
                    </div>
                    <div className='small-images-container'>
                        {image?.map((item, i) => (
                            <img
                                key={i}
                                src={urlFor(item)}
                                className={i === index ? 'small-image selected-image' : 'small-image'}
                                onMouseEnter={() => setIndex(i)}
                            />
                        ))}
                    </div>
                </div>
                <div className='product-detail-desc'>
                    <h1>{name}</h1>
                    <div className='reviews'>
                        <div>
                            {[...Array(Math.min(star))].map((_, index) => (
                                <AiFillStar key={index} />
                            ))}
                            {[...Array(Math.min(totalStar - star))].map((_, index) => (
                                <AiOutlineStar key={index} />
                            ))}
                        </div>
                        <p>
                            {sellerExperience}
                        </p>
                    </div>
                    <h4>Details:</h4>
                    <p>{details}</p>
                    <p className='price'>${price}</p>
                    <div className='quantity'>
                        <h3>Quantity:</h3>
                        <p className='quantity-desc'>
                            <span className='minus' onClick={decQty}>
                                <AiOutlineMinus />
                            </span>
                            <span className='mun' onClick="">
                                {qty}
                            </span>
                            <span className='plus' onClick={incQty}>
                                <AiOutlinePlus />
                            </span>
                        </p>
                    </div>
                    <p>庫存：{inventory}</p>
                    <div className='buttons'>
                        <button type='button' className='add-to-cart' onClick={() => onAdd(product, qty)}>加到購物車</button>
                        <button type='button' className='buy-now' onClick={() => toggleStartBuyingPage()}>現在買</button>
                    </div>
                    {buyNowPage && (
                        <BuyNowPage
                            product={product}
                            qty={qty}
                            price={price}
                            toggleStartBuyingPage={toggleStartBuyingPage}
                            updateInventoryAndCreateOrder={updateInventoryAndCreateOrder}
                            isLoading={isLoading}
                        />
                    )}

                    <div className='buy-now-background' onClick={() => toggleStartBuyingPage()} style={{ display: buyNowPage ? 'block' : 'none' }}>

                    </div>
                </div>
            </div>
            <div className='maylike-products-wrapper' >
                <h2>其他好物</h2>
                <div className='marquee'>
                    <div className='maylike-products-container track'>
                        {products.map((item) => (
                            <Product
                                key={item._id}
                                product={item}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}

export const getStaticPaths = async () => {
    const query = `*[_type == "product"]{
                slug{
                current
            }
    }
            `;
    const products = await client.fetch(query);
    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }));
    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({ params: { slug } }) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product" && inventory > 0]'

    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery);


    return {
        props: { products, product }
    }
}


export default ProductDetails
