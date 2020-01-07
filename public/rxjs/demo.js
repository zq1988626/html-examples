class AppHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            title: null,
        };
    }

    render() {
        return (
            <div className="flex header">
                {this.props.title}
            </div>
        );
    }
}

class Menu extends React.Component {
    constructor() {
        super();
        this.state = {
            title: null,
        };
    }

    render() {
        return (
            <div class="menubox">
                <ul class="menu">
                    <li>list</li>
                    <li>add</li>
                    <li>update</li>
                </ul>
            </div>
        );
    }
}

class PageList extends React.Component {
    constructor() {
        super();
        this.state = {
            value: null,
        };
    }

    render() {
        return (
            <button className="square" onClick={() => alert('click')}>
            {this.props.value}
            </button>
        );
    }
}


class App extends React.Component {
    constructor() {
        super();
        this.state = {

        };
    }
    renderDetail(){
        
    }
    render() {
        let DynamicDetail = this.renderDetail(pageType);    //动态拿到这个组件
        return (
            <div class="full-height flex-column">
                <AppHeader title="RXJS DEMO" />
                <div class="flex flex-item">
                    <Menu />
                    <div class="flex-item">
                        
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);