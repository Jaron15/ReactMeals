import {useReducer} from 'react';

import CartContext from "./cart-context";

const defaultCartState = {
    items: [],
    totalAmount: 0
}

const cartReducer = (state, action) => {
    if (action.type === 'ADD_ITEM') {
        // provious total amount + price * quantity of items added 
        const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount;
        // finds items in state whos id matches the incoming items id 
        const existingCartItemIndex = state.items.findIndex(item =>  item.id === action.item.id);
        // specifies the item which is being added AGAIN
        const existingCartItem = state.items[existingCartItemIndex];
        let updatedItems;
        
        // if the item added is already in the cart, update quantity instead of adding a new item 
        if (existingCartItem) {
           const updatedItem = {
                ...existingCartItem,
                amount: existingCartItem.amount + action.item.amount 
            };
    // creates a new array for cart items, bringing in the existing items
            updatedItems = [...state.items];
    // updates the object (item) that already exists into the new object 'updatedItem' to reflect updated properties 
            updatedItems[existingCartItemIndex] = updatedItem
        } else {
    // else just make a copy of the prvious array with the new item added(concat) 
            updatedItems = state.items.concat(action.item)
        }
        
        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        }
    }

    if (action.type === 'REMOVE_ITEM') {
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.id);
        const existingItem = state.items[existingCartItemIndex];
        const updatedTotalAmount = state.totalAmount - existingItem.price;
        let updatedItems;
        if (existingItem.amount === 1) {
            updatedItems = state.items.filter(item => item.id !== action.id)
        } else {
            const updatedItem = {...existingItem, amount: existingItem.amount - 1};
            updatedItems = [...state.items];
            updatedItems[existingCartItemIndex] = updatedItem;
        }
        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        }
    }   
    return defaultCartState
}

const CartProvider = props => {
const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState)

const addItemToCartHandler = item => {
    dispatchCartAction({type: 'ADD_ITEM', item: item})
};

const removeItemFromCartHandler = id => {
    dispatchCartAction({type: 'REMOVE_ITEM', id: id})
};

const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler
}

    return (
        <CartContext.Provider value={cartContext}>
            {props.children}
        </CartContext.Provider>
    )
}
export default CartProvider;