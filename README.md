# Clothica - багатосторінковий адаптивний e-commerce сайт.

Clothica — це багатосторінковий адаптивний вебсайт магазину одягу, створений як MVP. Проєкт реалізує
каталог товарів, кошик, оформлення замовлення, авторизацію та особистий кабінет.

Основна задача — забезпечити сучасний і зручний інтернет-магазин із використанням сучасних
веб-технологій.

## Features

- Адаптивна верстка (mobile/tablet/desktop)
- Mobile First, CSS Modules
- Публічні та приватні маршрути (Next.js 15)
- Глобальний стан через Zustand
- React Query: кешування та інвалідація
- Indicators loading / error
- Формы: Formik + Yup
- Slider: Swiper.js
- Анімації (опційно): Framer Motion / GSAP

## Tech Stack

- Next.js 15 (App Router)
- React.js
- Zustand
- React Query
- Formik + Yup
- CSS Modules
- Swiper.js
- Prettier

## Installation

- git clone https://github.com/AndriiOshlakov/dream-frontend
- cd dream-frontend
- npm install
- npm run dev

## Usage/Examples

Щоб запустити проєкт у режимі розробки:

```bash
npm run dev
```

Або зібрати продакшн:

```bash
npm run build
npm start
```

## Pages

- / — Головна
- /categories — Категорії
- /goods — Товари
- /goods/[id] — Карточка товару
- /basket — Кошик
- /order — Оформлення
- /profile — Кабінет
- /auth/login — Вхід
- /auth/register — Реєстрація

## Additional Info

Для форматування README:

- readme.so/editor
- dillinger.io

© 2025 Clothica

## Authors

- 👨‍💻 **Sergiy Vitruk** — Backend Developer  
  GitHub: https://github.com/SergiyVitruk
- 👨‍💻 **Oleksandr Kuzmenko** — Backend Developer  
  GitHub: https://github.com/alex-kuzmenko1
- 👩‍💻 **Liudmyla Belikova** — Backend Developer  
  GitHub: https://github.com/liudmyla21-belikova

- 👩‍💻 **Andrii Oshlakov** — Frontend Developer  
  GitHub: https://github.com/AndriiOshlakov
- 👩‍💻 **Liudmyla Pominchuk** — Frontend Developer  
  GitHub: https://github.com/Liudmyla537
- 👩‍💻 **Svitlana Shumal** — Frontend Developer  
  GitHub: https://github.com/svitlana-shumal
- 👨‍💻 **Oleksii Rudenko** — Frontend Developer  
  GitHub: https://github.com/oleks11-rudenko
- 👩‍💻 **Oleksandra Balunova** — Frontend Developer  
  GitHub: https://github.com/AleksandraCherevko
- 👩‍💻 **Maryana Rashkevych** — Frontend Developer  
  GitHub: https://github.com/MaryanaRashkevych
- 👨‍💻 **Oleksandr** — Frontend Developer  
  GitHub: https://github.com/oleksandrboo77
- 👩‍💻 **OleksandraOvcharova** — Frontend Developer  
  GitHub: https://github.com/OleksandraOvcharova

## Documentation

**📘 API Documentation (Swagger):**  
https://dream-backend-a69s.onrender.com/api-docs

**🖥️ Backend Server:**  
https://dream-backend-a69s.onrender.com

**🎨 Figma Design (UI/UX):**  
https://www.figma.com/design/c5nshg5DfSyuEFOtyWwMcR/Clothica?node-id=9202-59537&t=kH58NcIct523QUKl-0

**📝 Technical Specification (ТЗ):**  
https://docs.google.com/spreadsheets/d/1bZy7Vg3V8DJYi15AjLOhh0sIj-xfUfkKhQvkshktCBg/edit?usp=sharing

## API Reference

Бекенд: https://dream-backend-a69s.onrender.com  
Повна документація (Swagger): /api-docs

---

### 🔐 Auth

#### Register user

```http
POST /api/auth/register
```

**Body (JSON):**

```json
{
  "name": "John",
  "email": "john@gmail.com",
  "password": "12345678"
}
```

#### Login user

```http
POST /api/auth/login
```

#### Logout user

```http
POST /api/auth/logout
```

#### Refresh session

```http
POST /api/auth/refresh
```

---

### 👤 Users

#### Get current user

```http
GET /api/users/current
```

> Requires authentication (cookie)

#### Update user

```http
PATCH /api/users/current
```

---

### 🏷️ Categories

#### Get categories

```http
GET /api/categories
```

**Query params:** | Parameter | Type | Description | |----------|------|-------------| | `page` |
number | page number | | `limit` | number | items per page |

---

### 🛍️ Goods

#### Get goods list

```http
GET /api/goods
```

**Query params:** | Parameter | Type | Description | |----------|------|-------------| | `category`
| string | filter by category id | | `minPrice` | number | minimum price | | `maxPrice` | number |
maximum price | | `page` | number | pagination | | `limit` | number | pagination |

#### Get single good

```http
GET /api/goods/{id}
```

| Parameter | Type   | Description                     |
| --------- | ------ | ------------------------------- |
| `id`      | string | **Required**. ID of the product |

---

### 🧾 Orders

#### Create order

```http
POST /api/orders
```

Requires auth.

**Body example:**

```json
{
  "items": [{ "goodId": "abc123", "quantity": 2 }],
  "delivery": "NovaPoshta",
  "payment": "card"
}
```

#### Get my orders

```http
GET /api/orders/my
```

#### Update order status (admin only)

```http
PATCH /api/orders/{id}/status
```

---

### ⭐ Feedbacks

#### Create feedback

```http
POST /api/feedbacks
```

#### Get feedbacks

```http
GET /api/feedbacks
```

---

### 📩 Subscriptions

#### Create subscription

```http
POST /api/subscriptions
```

**Body example:**

```json
{
  "email": "customer@example.com"
}
```

---
