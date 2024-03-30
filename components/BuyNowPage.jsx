import React from 'react';
import { FaArrowCircleLeft } from "react-icons/fa";
import styled from 'styled-components';

const BuyNowPage = ({ product, qty, price, toggleStartBuyingPage, updateInventoryAndCreateOrder, isLoading }) => {

    const FormGroup = styled.div`
  display: flex;
  align-items: center; 
  justify-content: center; /* 使子元素靠右對齊 */
  margin-bottom: 0.3rem;
  gap: 0.5rem; 
`;

    const Label = styled.label`
  margin-bottom: 0; 
  margin-right:30px;
`;

    const Input = styled.input`
  flex: 0 1 250px; /* 允許縮小到 min-content，但不擴展超過 300px */
  max-width: 250px; /* 最大寬度為 200px，但可以在小容器中收縮 */
  padding: 0.3rem;
  border: 1px solid #ccc;
  border-radius: .25rem;
`;


    return (
        <div className='buy-now-page' style={{ display: 'block' }}> {/* 移除控制顯示的 inline-style，交給父組件控制 */}
            <div>
                <FaArrowCircleLeft
                    onClick={() => toggleStartBuyingPage()}
                    size={25}
                    style={{ margin: '20px', cursor: 'pointer' }} />
                <div className='buy-now-page-container'>
                    <h2 style={{ paddingTop: '30px' }}>購買資訊</h2>
                    <p>${product.price} {product.name} {qty} 件</p>
                    <div>
                        {price * qty >= 200 ? (
                            <>
                                <h3 style={{ paddingTop: '15px' }}>免運費</h3>
                                <h2 style={{ paddingTop: '15px' }}>匯款金額：{price * qty}</h2>
                            </>
                        ) : (
                            <>
                                <h3 style={{ paddingTop: '15px' }}>運費65元（滿200免運）</h3>
                                <h2 style={{ paddingTop: '15px' }}>匯款金額：{price * qty + 65}</h2>
                            </>
                        )}
                    </div>

                    <div className='payment-info' style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '25px' }}>
                        <div style={{ flex: '1' }}>
                            <h2>匯款資訊</h2>
                            <p>代碼：808 玉山銀行</p>
                            <p>帳號：0026979097631</p>
                        </div>
                        <div style={{ flex: '1' }}>
                            <img src='/charge.png' style={{ width: '60%' }} alt='QR Code' />
                        </div>
                    </div>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        // 收集表單資料
                        const formData = {
                            recipient: document.getElementById('recipient').value,
                            address: document.getElementById('address').value,
                            phone: document.getElementById('phone').value,
                            comment: document.getElementById('comment').value,
                            email: document.getElementById('email').value,
                            price: price * qty,
                            qty: qty,
                            productName: product.name,
                        };

                        updateInventoryAndCreateOrder(product._id, qty, formData);
                    }}>
                        <FormGroup>
                            <Label htmlFor="recipient">收件姓名</Label>
                            <Input type="text" id="recipient" name="recipient" required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="address">寄件地址</Label>
                            <Input type="text" id="address" name="address" required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="email">電子信箱</Label>
                            <Input type="text" id="email" name="email" required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="phone">聯絡電話</Label>
                            <Input type="tel" id="phone" name="phone" required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="comment">其他備註</Label>
                            <Input type="string" id="comment" name="comment" />
                        </FormGroup>
                        <div>
                            {isLoading && <span className="loader"></span>}
                        </div>
                        <div>
                            <button
                                type='submit'
                                className='btn'
                            >
                                已匯款</button>
                            <p>匯款完成再點哦</p>
                        </div>
                    </form>

                    <div className='paid-btn'>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyNowPage;
