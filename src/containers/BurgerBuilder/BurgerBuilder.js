import React, { Component } from 'react'
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../Axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BugerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        axios.get('/ingredients.json')
        .then( response => {
            this.setState({ingredients: response.data, loading: true})
        })
        .catch(error => {
            console.log(error)
            this.setState({error: true})
        })
    }

    updatePurchase = (ingredients) => {
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey]
        })
        .reduce((sum, el) => {
            return sum + el
        }, 0)

        this.setState({purchasable: sum > 0})
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
        // this.setState({loading: true})
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.price,
        //     customer: {
        //         name: 'Ion',
        //         address: {
        //             street: 'Teststreet 1',
        //             zipCode: '21435',
        //             country: 'italy'
        //         },
        //         email:'test@test.com'
        //     },
        //     deliveryMode: 'fastest'
        // }

        // axios.post('/orders', {order})
        // .then(response => {
        //     console.log(response)
        //     this.setState({loading: false, purchasing: false})
        // })
        // .catch(error => {
        //     console.log(error)
        //     this.setState({loading: false})

        // })

        const queryParams = []
        for (let i in this.state.ingredients) {
            queryParams.push(
            encodeURIComponent(i) + 
            '=' + 
            encodeURIComponent(this.state.ingredients[i]))
        }

        const queryString = queryParams.join('&')

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        })
    }

    render () {
        const disabledInfo = {...this.state.ingredients}
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0 
        }

        let orderSummary = (<Spinner />)
        let burger = this.state.error ? <p> Ingredients can't be loaded</p> : (<Spinner />)

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchanseHandler}
                        price={this.state.totalPrice}
                        />
                </Aux>
            )
        }

        if (this.state.loading) {
            orderSummary = (
                <OrderSummary 
                purchaseCancelled={this.purchanseCancelHandler}
                purchaseContinued={this.purchanseContinueHandler}
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
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

export default withErrorHandler( BugerBuilder, axios )
