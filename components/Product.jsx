import React from 'react';
import Link from 'next/link';


import { urlFor } from '../sanity/lib/client.js'
import product from '@/sanity/product.js'

const Product = ({ product: { image, name, slug, price } }) => {
    return (
        <div>
            <Link href={`/product/${slug.current}`}>
                <div className='product-card'>
                    <img
                        src={urlFor(image && image[0])}
                        width={250}
                        height={160}
                        className='product-image'
                    />
                    <p className='product-name'>{name}</p>
                    <p className='product-price'>${price}</p>
                </div>
            </Link>
        </div>
    )
}

export default Product
