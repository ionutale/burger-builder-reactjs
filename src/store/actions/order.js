import * as actionTypes from './actionTypes'
import axios from '../../Axios-orders'

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    }
}

export const purhcaseBugerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    }
}

export const purchaseBurgerStart = (orderData) => {
    return dispatch => {
        axios.post('/orders.json', orderData)
        .then( response => {
            console.log(response.data)
            dispatch(purchaseBurgerSuccess(response.data.id, orderData))
        })
        .catch( error => {
            dispatch(purhcaseBugerFail(error))
        })
    }
}
