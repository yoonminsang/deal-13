// import './style.scss';
import Main from './components/main';
import Category from './components/category';

// action에 로그인 로그아웃 생각중
interface ActionObj {
  go: string;
  back: string;
}
interface RenderObj {
  category: string;
}
// interface State {
//   user: null | string;
//   depth: string[];
// }

const actionObj: ActionObj = {
  go: 'go',
  back: 'back',
};
const renderObj: RenderObj = {
  category: 'category',
};

function App() {
  const app = document.querySelector('#app');

  const go = (next: string): void => {
    const nextDepth = [...this.state.depth, next];
    this.setState(actionObj.go, { ...this.state, depth: nextDepth });
  };
  const back = (): void => {
    const nextDepth = this.state.depth.slice(0, this.state.depth.length - 1);
    this.setState(actionObj.back, { ...this.state, depth: nextDepth });
  };
  const historyPush = (): void => {
    const nextUrl = this.state.depth.join('/') || '/';
    history.pushState('', '', nextUrl);
  };

  this.state = {
    user: null,
    depth: [],
  };

  const main = new Main({ app, user: this.state.user, go });
  const category = new Category({ app, user: this.state.user, go, back });

  this.setState = (action: string, nextState: any) => {
    console.log(
      'setstate',
      'action:',
      action,
      'this.state: ',
      this.state,
      'nextstate: ',
      nextState,
    );
    this.state = nextState;
    switch (action) {
      case actionObj.go:
      case actionObj.back:
        historyPush();
        return this.render(action);
      //   case LOGIN:
      //   case LOGOUT:
      //   case USER:
      //     return;
    }
  };
  this.render = (action: string) => {
    console.log('render', action, this.state);
    switch (action) {
      case actionObj.go:
        const name = this.state.depth[this.state.depth.length - 1];
        switch (name) {
          case renderObj.category:
            return category.render();
          default:
            console.log('render name is not found');
            return;
        }
      case actionObj.back:
        const lastChild = app.lastElementChild;
        lastChild.classList.replace('slidein', 'slideout');
        setTimeout(() => {
          app.removeChild(lastChild);
        }, 500);
        return;
      default:
        main.render();
    }
  };
  this.render();
}

new App();
