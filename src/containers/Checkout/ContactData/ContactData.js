import React, { Component } from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'
import axios from '../../../Axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm: {
                name: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Name'
                    }
                },
                street: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Street'
                    }
                },
                zipCode: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'ZIP CODE'
                    }
                },
                country: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Country'
                    }
                },
                email:{
                    elementType: 'input',
                    elementConfig: {
                        type: 'email',
                        placeholder: 'Email'
                    }
                },
                deliveryMode: {
                    elementType: 'select',
                    elementConfig: {
                        options: [{value: 'fastest', displayValue: 'Fastest'},
                                {value: 'cheapest', displayValue: 'Cheapest'}]
                    }
                }
        },
        loading: false
    }

    orderHnadler = (event) => {
        event.preventDefault()
        this.setState({loading: true})
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Ion',
                address: {
                    street: 'Teststreet 1',
                    zipCode: '21435',
                    country: 'italy'
                },
                email:'test@test.com'
            },
            deliveryMode: 'fastest'
        }
        console.log(order)
        axios.post('/orders.json', {...order})
        .then(response => {
            console.log(response)
            this.setState({loading: false})
            this.props.history.push('/')
        })
        .catch(error => {
            console.log(error)
            this.setState({loading: false})

        })
    }

    render() {
        const formElementsArray = []
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key],
            })
        }
        console.log(formElementsArray)
        let form = (
            <form>
                {formElementsArray.map(formElement => {
                    return <Input
                    key={formElement.id} 
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    />
                })}
                <Button 
                btnType="Success"
                clicked={this.orderHnadler}
                >ORDER</Button>
            </form>
        )

        if ( this.state.loading ) {
            form = ( <Spinner /> )
        }

        return (
            <div className={classes.ContactData} >
                <h4> Enter your contact data </h4>
                {form}
            </div>
        )
    }
}

export default ContactData
