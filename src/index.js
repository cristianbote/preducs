import React from 'react';
import ReactDOM from 'react-dom';
import initialStore from './stores/initial-store';

class TodoItem extends React.Component {

    constructor(props, ...args) {
        super(props, ...args);

        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleOnChange(e) {
        this.props.store.update({
            name: this.props.name,
            checked: !this.props.checked
        });
    }

    render() {
        return (
            <label className={this.props.checked && "selected"}>
                <input type="checkbox" name="check" checked={this.props.checked} onChange={this.handleOnChange} />
                {this.props.name}
            </label>
        )
    }

}

class TodoItems extends React.Component {

    render() {
        return (
            <div>
                {this.props.items.map(data => {
                    return <TodoItem store={this.props.store} key={data.name} name={data.name} checked={data.checked} />
                })}
            </div>
        )
    }

}

class AppComponent extends React.Component {

    constructor(props, ...args) {
        super(props, ...args);

        this.state = this.props.store.data;

        this.handleAddNewItem = this.handleAddNewItem.bind(this);
        this.handleStoreUpdates = this.handleStoreUpdates.bind(this);
        this.props.store.subscribe(this.handleStoreUpdates);
    }

    handleStoreUpdates(type, data) {
        this.setState({ ...data });
    }

    handleAddNewItem(e) {
        if (e.nativeEvent.keyCode === 13) {
            let value = this.addTodoItemElement.value;

            this.addTodoItemElement.value = '';

            this.props.store.update({
                name: value,
                checked: false
            });
        }
    }

    getTotalCheckedItems() {
        return this.state.items.filter(item => {
            return item.checked
        }).length;
    }

    render() {
        return (
            <div>
                <header>
                    <h1>Todo List</h1>
                    You have completed {this.getTotalCheckedItems()} / {this.state.items.length}
                </header>
                <main>
                    <section>
                        <input ref={ref => this.addTodoItemElement = ref} type="text" name="addTodoItem" placeholder="Type a new todo and press enter" onKeyPress={this.handleAddNewItem}/>
                    </section>
                    <TodoItems items={this.state.items} store={this.props.store} />
                </main>
            </div>
        )
    }

}

ReactDOM.render(<AppComponent store={initialStore} />, document.querySelector('.app'));