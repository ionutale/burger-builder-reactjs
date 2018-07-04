import React, { Component } from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'
import axios from '../../../Axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '', 
            postaCode: ''
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
        let form = (<form>
            <input className={classes.Input} type="text" name="name" placeholder="Your name" />
            <input className={classes.Input} type="email" name="email" placeholder="Your email" />
            <input className={classes.Input} type="text" name="street" placeholder="Your street" />
            <input className={classes.Input} type="text" name="postalCode" placeholder="Your postalCode" />
            <Button 
            btnType="Success"
            clicked={this.orderHnadler}
            >ORDER</Button>
        </form>)
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
