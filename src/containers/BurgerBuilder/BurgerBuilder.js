import React, { Component } from 'react'
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../Axios-orders'

import { connect } from 'react-redux'
import * as burgerBuilderActions from '../../store/actions/index'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BugerBuilder extends Component {
    state = {
        purchasing: false,
    }

    componentDidMount () {
        console.log(this.props)
        this.props.onInitIngredients()
    }

    updatePurchase = (ingredients) => {
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey]
        })
        .reduce((sum, el) => {
            return sum + el
        }, 0)

        return sum > 0
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1
        const updatedIngredients = {
            ...this.state.ingredients
        }

        updatedIngredients[type] = updatedCount
        const priceAddition = INGREDIENT_PRICES[type]; 
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchase(updatedIngredients)
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount 
        const priceDeduction = INGREDIENT_PRICES[type]; 
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchase(updatedIngredients)
    }

    purchanseHandler = () => {
        this.setState({purchasing: true})
    }

    purchanseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchanseContinueHandler = () => {
        this.props.history.push('/checkout')
    }

    render () {
        const disabledInfo = {...this.props.ing}
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0 
        }

        let orderSummary = null
        let burger = this.props.error ? <p> Ingredients can't be loaded</p> : (<Spinner />)

        if (this.props.ing) {
            console.log('this.props.ing:', this.props.ing)
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ing}/>
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchase(this.props.ing)}
                        ordered={this.purchanseHandler}
                        price={this.props.price}
                        />
                </Aux>
            )
            
            orderSummary = (<OrderSummary 
                purchaseCancelled={this.purchanseCancelHandler}
                purchaseContinued={this.purchanseContinueHandler}
                ingredients={this.props.ing}
                price={this.props.price}
                />
            )
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchanseCancelHandler}> 
                    {orderSummary}
                </Modal>
                {burger}   
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        ing: state.ingredients,
        price: state.totalPrice,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( BugerBuilder, axios ))
