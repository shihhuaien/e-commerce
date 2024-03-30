import product from "@/sanity/product";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
import { client } from '../sanity/lib/client';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);
    const [buyNowPage, setBuyNowPage] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [ifBuyInCartPage, setIfBuyInCartPage] = useState(false);

    let foundProduct;
    let index;

    const showBuyInCartPage = () => {
        setShowCart(false);
        setIfBuyInCartPage(current => !current);
    }

    const updateInventoryAndCreateOrderByCart = async function (formData) {
        const currentTime = new Date().toISOString();
        setIsLoading(true);
        console.log(isLoading);
        try {
            const inventoryUpdates = cartItems.map(async (product) => { // 注意这里直接返回 async 函数的调用
                console.log(`Product ID: ${product._id}, Quantity to decrement: ${product.quantity}`);
                const response = await client
                    .patch(product._id)
                    .dec({ inventory: product.quantity })
                    .commit();
                console.log('庫存更新成功', response);
            });
            await Promise.all(inventoryUpdates);

        } catch (error) {
            console.error('更新庫存時發生錯誤:', error);
        } finally {
            setIsLoading(false); // 無論成功或失敗，結束加載時設置為 false
        }

        // 創建訂單
        const productNames = cartItems.map(item => item.name).join(', ');
        const productQtys = cartItems.map(item => item.quantity).join(', ');
        await client.create({
            _type: 'order',
            recipient: formData.recipient,
            address: formData.address,
            phone: formData.phone,
            price: totalPrice,
            comment: formData.comment,
            qty: productQtys,
            dayTime: currentTime,
            productName: productNames,
        })
        console.log('建立訂單成功', formData.recipient, productNames, productQtys);


        // 下載訂單資料成txt檔案
        const productNameAndQty = cartItems.map(item => `${item.name}(${item.quantity})`).join(', ');
        const orderInfoLines = [
            '感謝光臨跳蚤市場~以下是訂單資訊',
            `收件人: ${formData.recipient}`,
            `品項/數量: ${productNameAndQty}`,
            `地址: ${formData.address}`,
            `聯絡電話: ${formData.phone}`,
            `訂單金額: ${totalPrice}`,
            `備註: ${formData.comment}`,
            `下單（匯款）時間: ${new Date().toISOString()}`,
            ``,
            '我們會在幾天內寄送物品到你的家，敬請期待：）',
            ``,
            `匯款資訊：`,
            '代碼：808 玉山銀行',
            '帳號：0026979097631',
        ];
        downloadOrderInfoAsPdf(formData, orderInfoLines);
        //清空購物車
        setCartItems([]);
        setTotalQuantities(0);
        //重設選擇產品數量
        setQty(1);
        // 顯示 toast 提示
        toast.success('謝謝購買跳蚤市場物品', {
            position: 'top-center',
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        //導回首頁
        router.replace('/');
        setIfBuyInCartPage(current => !current);
    }

    const updateInventoryAndCreateOrder = async function (productId, quantity, formData) {
        setIsLoading(true);
        const currentTime = new Date().toISOString();

        try {
            // 更新庫存
            await client
                .patch(productId)
                .dec({ inventory: quantity }) // 使用 dec 方法減少庫存數量
                .commit(); // 提交更新

            console.log('庫存更新成功', productId, quantity);


            // 創建訂單
            await client.create({
                _type: 'order',
                recipient: formData.recipient,
                address: formData.address,
                phone: formData.phone,
                price: formData.price,
                comment: formData.comment,
                qty: formData.qty,
                dayTime: currentTime,
                productName: formData.productName,
            })
            console.log('建立訂單成功', formData.recipient);
            setQty(1);
            // 下載訂單資料成txt檔案
            const orderInfoLines = [
                '感謝光臨跳蚤市場~以下是訂單資訊',
                `收件人: ${formData.recipient}`,
                `品項: ${formData.productName}`,
                `件數: ${formData.qty}`,
                `地址: ${formData.address}`,
                `聯絡電話: ${formData.phone}`,
                `訂單金額: ${formData.price}`,
                `備註: ${formData.comment}`,
                `下單（匯款）時間: ${new Date().toISOString()}`,
                ``,
                '我們會在幾天內寄送物品到你的家，敬請期待：）',
                ``,
                `匯款資訊：`,
                '代碼：808 玉山銀行',
                '帳號：0026979097631',
            ];

            downloadOrderInfoAsPdf(formData, orderInfoLines);

            // 顯示 toast 提示
            toast.success('謝謝購買跳蚤市場物品', {
                position: 'top-center',
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            router.replace('/');
            setBuyNowPage(current => !current);
        } catch (error) {
            console.error('更新庫存時發生錯誤:', error);
        } finally {
            setIsLoading(false); // 無論成功或失敗，結束加載時設置為 false
        }
    }

    const downloadOrderInfoAsPdf = (formData, orderInfoLines) => {
        // 創建一個臨時 canvas 元素來繪製訂單資訊
        const canvas = document.createElement('canvas');
        canvas.width = 800; // 設定適當的寬度
        canvas.height = 600; // 設定適當的高度
        const ctx = canvas.getContext('2d');

        // 設置字體和填充顏色
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';

        // 繪製訂單資訊到 canvas

        orderInfoLines.forEach((line, index) => {
            ctx.fillText(line, 10, 20 + (index * 30)); // 調整間距適當
        });

        // 將 canvas 轉換成圖片並添加到 PDF 中
        const dataURL = canvas.toDataURL('image/png');
        const doc = new jsPDF();

        // 根據需要調整圖片在PDF中的位置和大小
        doc.addImage(dataURL, 'PNG', 10, 10, 180, 120);
        doc.save('跳蚤市場訂單.pdf');
    };

    const toggleStartBuyingPage = () => {
        setBuyNowPage(current => !current);
    }

    const toggleBuyInCartPag = () => {
        setIfBuyInCartPage(current => !current);
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems)
    }

    const toggleCartItemQuantities = (id, value) => {
        const updatedCartItems = cartItems.map((item) => {
            if (item._id === id) {
                if (value === 'inc' && item.quantity < item.inventory) {
                    setTotalPrice((prevTotalPrice) => prevTotalPrice + item.price);
                    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
                    return { ...item, quantity: item.quantity + 1 };
                } else if (value === 'dec' && item.quantity > 1) {
                    setTotalPrice((prevTotalPrice) => prevTotalPrice - item.price);
                    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
                    return { ...item, quantity: item.quantity - 1 };
                }
            }
            return item;
        });

        setCartItems(updatedCartItems);
    }

    const incQty = (product) => {

        setQty((prevQty) => {
            if (prevQty >= product.inventory) {
                return product.inventory
            }
            else {
                return prevQty + 1
            }
        });
    }
    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1;
            return prevQty - 1
        });
    }

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if (checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            setCartItems(updatedCartItems);
        }
        else {
            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }])
        }
        toast.success(`${qty} 件 ${product.name} 已加入購物車`)

    }

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuantities,
                onRemove,
                buyNowPage,
                toggleStartBuyingPage,
                updateInventoryAndCreateOrder,
                isLoading,
                updateInventoryAndCreateOrderByCart,
                ifBuyInCartPage,
                toggleBuyInCartPag,
                showBuyInCartPage
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)