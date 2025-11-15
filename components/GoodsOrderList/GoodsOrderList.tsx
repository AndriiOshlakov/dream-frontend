'use client';

import { useShopStore } from '@/lib/store/cartStore';
import css from './GoodsOrderList.module.css';
import Image from 'next/image';

export default function GoodsOrderList() {
  const { cartItems, removeFromCart, updateQuantity } = useShopStore();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 0 ? 50 : 0;
  const total = subtotal + delivery;

  return (
    <div className={css.orderContainer}>
      <ul className={css.orderList}>
        {cartItems.length === 0 ? (
          <li className={css.orderItem}>
            <p>Ваш кошик порожній</p>
          </li>
        ) : (
          cartItems.map((item) => (
            <li key={item.id} className={css.orderItem}>
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={82}
                  height={101}
                  className={css.orderImg}
                />
              )}

              <div className={css.orderGoodInfo}>
                <div className={css.orderGoodWrapper}>
                  <h3 className={css.orderGoodName}>{item.name}</h3>
                  <div className={css.orderRaiting}>
                    <span className={css.stars}>⭐{item.rating}</span>
                    <span className={css.reviews}>({item.reviewsCount})</span>
                  </div>
                </div>

                <div className={css.orderGoodRigth}>
                  <div className={css.orderGoodRigthActions}>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      className={css.orderQuantity}
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    />
                    <button className={css.orderDeleteBtn} onClick={() => removeFromCart(item.id)}>
                      ✕
                    </button>
                  </div>
                  <div className={css.orderPrice}>{item.price * item.quantity} ₴</div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      {cartItems.length > 0 && (
        <div className={css.orderTotalPriceWrapper}>
          <div className={css.orderPriceItem}>
            <span className={css.orderProvisionalPrice}>Проміжний підсумок:</span>
            <span className={css.orderProvisionalPriceValue}>{subtotal} ₴</span>
          </div>
          <div className={css.orderPriceItem}>
            <span className={css.dorderDeliveryPrice}>Доставка:</span>
            <span className={css.orderDeliveryPriceValue}>{delivery} ₴</span>
          </div>
          <div className={css.orderTotalPrice}>
            <span className={css.torderTotalPrice}>Всього:</span>
            <span className={css.orderTotalPriceValue}>{total} ₴</span>
          </div>
        </div>
      )}
    </div>
  );
}
