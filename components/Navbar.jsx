import React from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';
import { Cart } from './';
import { useStateContext } from '../context/StateContext';
import { BuyInCartPage } from './index';




const Navbar = () => {
    const {
        totalPrice,
        totalQuantities,
        cartItems,
        showCart,
        setShowCart,
        toggleCartItemQuantities,
        onRemove,
        updateInventoryAndCreateOrderByCart,
        ifBuyInCartPage,
        isLoading,
        toggleBuyInCartPag,
    } = useStateContext();
    return (
        <div className='navbar-container'>
            <p className='logo'>
                <Link href='/'>跳蚤市場</Link>
            </p>
            <button type='button' className='cart-icon' onClick={() => setShowCart(true)}>
                <AiOutlineShopping />
                <span className='cart-item-qty'>{totalQuantities}</span>
            </button>

            {showCart && <Cart />}
            {ifBuyInCartPage && (
                <BuyInCartPage
                    cartItems={cartItems}
                    toggleBuyInCartPag={toggleBuyInCartPag}
                    updateInventoryAndCreateOrderByCart={updateInventoryAndCreateOrderByCart}
                    isLoading={isLoading}
                    totalPrice={totalPrice}
                />
            )}
            <div className='buy-now-background' onClick={() => toggleBuyInCartPag()} style={{ display: ifBuyInCartPage ? 'block' : 'none' }}>
            </div>

        </div>
    )
}

export default Navbar
