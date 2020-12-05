import React, { Component } from 'react';

import Auxi from '../../hoc/Auxi/Auxi';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENTS_PRICE = {
    salad: 0.5,
    cheese: 1,
    bacon: 1.5,
    meat: 2
}

class BurgerBuilder extends Component {
    state = {
        ingredients:{
            salad:0,
            bacon:0,
            cheese:0,
            meat:0
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = { ...this.state.ingredients};  
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENTS_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({ingredients : updatedIngredients,
                        totalPrice : newPrice});

        this.updatePurchasable(updatedIngredients);                        
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if (oldCount <= 0) {
            return;
        }

        const updatedCount = oldCount - 1;
        const updatedIngredients = { ...this.state.ingredients};  

        updatedIngredients[type] = updatedCount;

        const priceDeductio = INGREDIENTS_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeductio;

        this.setState({ingredients : updatedIngredients,
            totalPrice : newPrice});

        this.updatePurchasable(updatedIngredients);
    }

    updatePurchasable(ingredients){
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum,el) => {
                return sum + el;
            }, 0);

        this.setState({purchasable : sum > 0});
    }

    purchaseHandler = () =>{
        this.setState({purchasing : true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing : false});
    }

    purchaseContinueHandler = () =>{
        this.setState({loading : true});
        const queryParams = [];
        for (let i  in this.state.ingredients ) {
            queryParams.push(encodeURIComponent(i) + '='
                            + encodeURIComponent(this.state.ingredients[i]))
        }

        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search:'?' + queryString
        });
    };


    render () {
        const disabledInfo = {...this.state.ingredients};

        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = <OrderSummary ingredients={this.state.ingredients}
            totalPrice={this.state.totalPrice}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/>

        if (this.state.loading){
            orderSummary = <Spinner />;
        }

        return (
            <Auxi>

                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>

                <Burger ingredients={this.state.ingredients}/>

                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}      
                    purchasable={this.state.purchasable}   
                    price={this.state.totalPrice}       
                    ordered={this.purchaseHandler}    
                    />

            </Auxi>
        );
    }
}

export default BurgerBuilder;