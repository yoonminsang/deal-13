import '../styles/Category.scss';

interface ICategory {
  id: number;
  name: string;
  url: string;
}

const createCategoryList = (
  categoryList: Array<ICategory>,
  category,
): string => {
  return (
    categoryList.reduce(
      (acc, cur) => acc + createCategoryItem(cur, category.name === cur.name),
      '<div class="category-list">',
    ) + '</div>'
  );
};

const createCategoryItem = (
  { id, name, url }: ICategory,
  active: boolean,
): string => {
  return `
    <div class="category-list-item ${
      active ? 'active' : ''
    }" data-id="${id}" data-name="${name}">
      <div style="background-image: url(${url})"></div>
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
    const { id, name } = categoryItem.dataset;
    setCategory(
      category.name === name
        ? { id: 0, category: '' }
        : { id: Number(id), name },
    );
    back();
  }
};

const isBackButton = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  return target.classList.contains('js-back');
};

function Category({ app, setCategory, back }) {
  interface StateObj {
    category: string;
  }
  const stateObj: StateObj = {
    category: 'category',
  };

  const $target = document.createElement('div');
  $target.className = 'category';
  const category = localStorage.getItem('category');
  this.state = {};
  this.state.category = category ? category : { id: 0, category: '' };
  this.state.categoryList = [];

  this.setState = (nextStateName, nextState) => {
    this.state = { ...this.state, [nextStateName]: nextState };
    this.rerender(nextStateName);
  };

  this.render = () => {
    $target.innerHTML =
      createHeader() +
      createCategoryList(this.state.categoryList, this.state.category);
    app.appendChild($target);
    setTimeout(() => $target.classList.add('slidein'), 0);
  };

  this.rerender = (changeStateName) => {
    switch (changeStateName) {
      case stateObj.category:
        if (this.state.category)
          $target.innerHTML =
            createHeader() +
            createCategoryList(this.state.categoryList, this.state.category);
        else console.log('category rerender error');
        return;
      default:
        console.log('state name is not found');
    }
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
