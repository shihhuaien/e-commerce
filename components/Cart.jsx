import React, { useRef } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';
import { useStateContext } from '../context/StateContext';
import { urlFor } from '../sanity/lib/client.js';
import product from '@/sanity/product';
import { BuyInCartPage } from './index';



const Cart = () => {
    const cartRef = useRef();
    const {
        totalPrice,
        totalQuantities,
        cartItems,
        setShowCart,
        toggleCartItemQuantities,
        onRemove,
        showBuyInCartPage
    } = useStateContext();

    return (
        <div className='cart-wrapper' ref={cartRef}>
            <div className='cart-container'>
                <button
                    type='button'
                    className='cart-heading'
                    onClick={() => setShowCart(false)} >
                    <AiOutlineLeft />
                    <span className='heading'>購物車</span>
                    <span className='cart-num-items'>({totalQuantities} 件)</span>
                </button>
                {cartItems.length < 1 && (
                    <div className='empty-cart'>
                        <AiOutlineShopping size={150} />
                        <h3>購物車空空如也</h3>
                        <Link href='/'>
                            <button
                                type='button'
                                onClick={() => setShowCart(false)}
                                className='btn' >
                                繼續逛逛
                            </button>
                        </Link>
                    </div>
                )}
                <div className='product-container'>
                    {cartItems.length >= 1 && cartItems.map((item) => (
                        <div className='product' key={item._id}>
                            <img src={urlFor(item?.image[0])} className='cart-product-image' />
                            <div className='item-desc'>
                                <div className='flex top'>
                                    <h5>{item.name}</h5>
                                    <h4>${item.price}</h4>
                                </div>
                                <div className='flex bottom'>
                                    <div>
                                        <p className='quantity-desc'>
                                            <span className='minus' onClick={() => toggleCartItemQuantities(item._id, 'dec')}>
                                                <AiOutlineMinus />
                                            </span>
                                            <span className='num' onClick="" >
                                                {item.quantity}
                                            </span>
                                            <span className='plus' onClick={() => toggleCartItemQuantities(item._id, 'inc')}>
                                                <AiOutlinePlus />
                                            </span>
                                        </p>
                                    </div>
                                    <button
                                        type='button'
                                        className='remove-item'
                                        onClick={() => onRemove(item)}
                                    >
                                        <TiDeleteOutline />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                    }
                </div>
                {cartItems.length >= 1 && (
                    <div className='cart-bottom'>
                        <div className='total'>
                            <h3>品項金額</h3>
                            <h3>${totalPrice}</h3>
                        </div>
                        <div className='btn-container'>
                            <button type='button' className='btn' onClick={() => showBuyInCartPage()}>
                                前往轉帳
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export default Cart
