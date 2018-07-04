import React, { Component } from 'react'
import Order from '../../components/Order/Order';
import Axios from '../../Axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import Spinner from '../../components/UI/Spinner/Spinner';
class Orders extends Component {
    state = {
        orders: [],
        loading: true
    }

    componentDidMount() {
        Axios.get('/orders.json')
        .then(res => {
            const fetchedOrders = []
            for ( let key in res.data) {
                fetchedOrders.push({
                    ...res.data[key],
                    id: key
                })
            }
            this.setState({loading: false, orders: fetchedOrders})
            console.log(this.state.orders)
        })
        .catch((error) => 
        {
            console.log(error)
            this.setState({loading: false})
        })
    }

    render() {
        let ordersArr = (
            <Spinner />
        )
        if (this.state.loading) {

        }

        return (
            <div>
                {this.state.orders.map( order => {
                    return <Order 
                    ingredients={order.ingredients}
                    price={order.price}
                    key={order.id}/>  
                })}
            </div>
        )
    }
}

export default withErrorHandler( Orders, Axios )
