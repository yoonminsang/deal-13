interface ICategory {
  id: number;
  name: string;
  image?: string;
}

const tmpList: ICategory[] = [
  {
    id: 1,
    name: '디지털기기',
    image: '',
  },
  {
    id: 2,
    name: '생활가전',
    image: '',
  },
  {
    id: 3,
    name: '가구/인테리어',
    image: '',
  },
  {
    id: 4,
    name: '게임/취미',
    image: '',
  },
  {
    id: 5,
    name: '생활/가공식품',
    image: '',
  },
  {
    id: 6,
    name: '스포츠/레저',
    image: '',
  },
  {
    id: 7,
    name: '여성패션/잡화',
    image: '',
  },
  {
    id: 8,
    name: '남성패션/잡화',
    image: '',
  },
  {
    id: 9,
    name: '유아동',
    image: '',
  },
  {
    id: 10,
    name: '뷰티/미용',
    image: '',
  },
  {
    id: 11,
    name: '반려동물/음반',
    image: '',
  },
  {
    id: 12,
    name: '도서/티켓/음반',
    image: '',
  },
];

const getCategoryList = (category: string): string => {
  return createCategoryList(tmpList, category);
};

const createCategoryList = (
  categoryList: Array<ICategory>,
  category,
): string => {
  return (
    categoryList.reduce(
      (acc, cur) => acc + createCategoryItem(cur, category === cur.name),
      '<div class="category-list">',
    ) + '</div>'
  );
};

const createCategoryItem = (
  { id, name, image }: ICategory,
  active: boolean,
): string => {
  return `
    <div class="category-list-item ${
      active ? 'active' : ''
    }" data-name="${name}">
      <div></div>
      <p>${name}</p>
    </div>
    `;
};

const createHeader = (): string => {
  return `
  <div class="top-bar off-white">
  <div>
    <div class="icon icon-left js-back"></div>
  </div>
  <div>
    <div class="top-bar__text">카테고리</div>
  </div>
  <div>
    <div class="icon"></div>
  </div>
</div>`;
};

const handleClickEvent = ({ e, category, setCategory, back }) => {
  const target = e.target as HTMLElement;
  const categoryItem: HTMLElement = target.closest('.category-list-item');
  if (categoryItem) {
    const name = categoryItem.dataset.name;
    setCategory(category === name ? 'all' : name);
    back();
  }
};

const isBackButton = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  return target.classList.contains('js-back');
};

function Category({ app, setCategory, user, back }) {
  const $target = document.createElement('div');
  $target.className = 'category slidein';
  this.state = {
    category: 'all',
  };
  this.setState = (category: string) => {
    this.state = {
      ...this.state,
      category,
    };
  };
  this.render = (category: string) => {
    this.setState(category);
    $target.classList.replace('slideout', 'slidein');
    $target.innerHTML = createHeader() + getCategoryList(this.state.category);
    app.appendChild($target);
  };

  $target.addEventListener('click', (e) => {
    if (isBackButton(e) && back()) {
      return;
    }
    handleClickEvent({
      e,
      category: this.state.category,
      setCategory,
      back,
    });
  });
}

export default Category;
