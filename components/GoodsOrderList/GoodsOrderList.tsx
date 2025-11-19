'use client';

import { useShopStore } from '@/lib/store/cartStore';
import css from './GoodsOrderList.module.css';
import Image from 'next/image';
import MessageNoInfo from '../MessageNoInfo/MessageNoInfo';
import { useRouter } from 'next/navigation';

export default function GoodsOrderList() {
  const { cartItems, removeFromCart, updateQuantity } = useShopStore();
  const router = useRouter();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 0 ? 50 : 0;
  const total = subtotal + delivery;

  const handleGoToGoods = () => {
    router.push('/goods');
  };

  return (
    <div className={css.goodsOrderContainer}>
      <ul className={css.goodsOrderList}>
        {cartItems.length === 0 ? (
          <li className={css.goodsOrderItem}>
            <MessageNoInfo
              text="Ваш кошик порожній, мерщій до покупок!"
              buttonText="До покупок"
              onClick={handleGoToGoods}
            />
          </li>
        ) : (
          cartItems.map((item) => (
            <li key={item.id} className={css.goodsOrderItem}>
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={82}
                  height={101}
                  className={css.goodsOrderImg}
                />
              )}

              <div className={css.goodsOrderGoodInfo}>
                <div className={css.goodsOrderGoodWrapper}>
                  <h3 className={css.goodsOrderGoodName}>{item.name}</h3>
                  <div className={css.goodsOrderRaiting}>
                    <span className={css.goodsOrderStars}>
                      <svg className={css.goodsOrderStarsIcon} width="16" height="16">
                        <use xlinkHref="symbol-defs.svg#icon-star-filled" />
                      </svg>
                      {item.rating}
                    </span>
                    <span className={css.goodsOrderReviews}>
                      <svg className={css.goodsOrderReviewsIcon} width="16" height="16">
                        <use xlinkHref="symbol-defs.svg#icon-comment" />
                      </svg>
                      ({item.reviewsCount})
                    </span>
                  </div>
                </div>

                <div className={css.goodsOrderGoodRigth}>
                  <div className={css.goodsOrderPrice}>{item.price * item.quantity} ₴</div>
                  <div className={css.goodsOrderGoodRigthActions}>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      className={css.goodsOrderQuantity}
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    />
                    <button
                      className={css.goodsOrderDeleteBtn}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <svg width="24" height="24">
                        <use xlinkHref="symbol-defs.svg#icon-delete" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      {cartItems.length > 0 && (
        <div className={css.goodsOrderTotalPriceWrapper}>
          <div className={css.goodsOrderPriceItem}>
            <span className={css.goodsOrderProvisionalPrice}>Проміжний підсумок:</span>
            <span className={css.orderProvisionalPriceValue}>{subtotal} ₴</span>
          </div>
          <div className={css.goodsOrderPriceItem}>
            <span className={css.goodsOrderDeliveryPrice}>Доставка:</span>
            <span className={css.goodsOrderDeliveryPriceValue}>{delivery} ₴</span>
          </div>
          <div className={css.goodsOrderPriceItem}>
            <span className={css.goodsOrderTotalPrice}>Всього:</span>
            <span className={css.goodsOrderTotalPriceValue}>{total} ₴</span>
          </div>
        </div>
      )}
    </div>
  );
}
