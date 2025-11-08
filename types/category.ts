// тип з бекенда
export interface CategoryApiItem {
  _id: {
    $oid: string;
  };
  name: string;
}

// тип з яким працюють компоненти
export interface Category {
  id: string;
  title: string;
  imageUrl: string;
}
