import Link from 'next/link';
import AuthNavigation from '../AuthNavigation/AuthNavigation';

export default function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <button onClick={onClose}>✕</button>
      <Link href="/" onClick={onClose}>
        Головна
      </Link>
      <Link href="/goods" onClick={onClose}>
        Товари
      </Link>
      <Link href="/categories" onClick={onClose}>
        Категорії
      </Link>
      <AuthNavigation />
      <Link href="/cart" onClick={onClose}>
        Кошик
      </Link>
    </div>
  );
}
