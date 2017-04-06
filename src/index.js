import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import configStore, {
    updateOrAddModifier,
    updateItemsModifier } from './stores/config-store';

class Container extends Component {

    constructor(props, ...args) {
        super(props, ...args);

        this.state = this.props.store.getState();
        this.handleStoreUpdates = this.handleStoreUpdates.bind(this);
        this.unsubscribe = this.props.store.subscribeToUpdates(this.handleStoreUpdates);
    }

    handleStoreUpdates(state) {
        this.setState(state);
    }

    getItems() {
        return this.state.items
            .map(item => {
                return <Item key={item.id} {...item} store={this.props.store} />
            });
    }

    setItemsInStore() {
        let items = [];
        let start = this.state.items.length;
        let end = start + this.state.step;

        for(; start < end; start += 1) {
            items.push({
                id: start,
                name: 'empty'
            });
        }

        this.props.store.update(
            items,
            updateItemsModifier
        )
    }

    addMoreItems() {
        this.setState({
            count: this.state.count + this.state.step
        });
    }

    render() {
        return (
            <div>
                <p>Here goes the items</p>
                <button onClick={() => this.setItemsInStore() }>Add {this.state.step} items</button>
                {this.getItems()}
            </div>
        )
    }

}

class Item extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: props.name
        };

        this.store = this.props.store;
    }

    componentWillReceiveProps(props) {
        if (props.name !== this.state.name) {
            this.setState({name: props.name});
            this.forceUpdate();
        }
    }

    componentDidMount() {
        setInterval(() => this.handleNameChange(), Math.floor(100 + Math.random() * 300));
    }

    shouldComponentUpdate() {
        return false;
    }

    handleNameChange() {
        let name = Math.floor(Math.random() * Date.now()).toString(18);

        this.store.update({
            id: this.props.id,
            name: name
        }, updateOrAddModifier);
    }

    render() {
        return (
            <div className="item">
                <span>{this.props.id}</span>
                [<span>{this.props.name}</span>]
                One item with one
                <button onClick={() => this.handleNameChange()}>button</button>
            </div>
        )
    }

}

class AppComponent extends Component {

    constructor(props, ...args) {
        super(props, ...args);
    }

    render() {
        return (
            <div>
                <Container store={this.props.store}/>
            </div>
        )
    }

}

ReactDOM.render(<AppComponent store={configStore} />, document.querySelector('.app'));