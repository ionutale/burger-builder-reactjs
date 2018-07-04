import React from 'react'
import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem';

const NavigationItems = () => {
    return(
        <ul className={classes.NavigationItems}>
            <NavigationItem link="/" exact>Burger Builder</NavigationItem>
            <NavigationItem link="/Orders">Orders</NavigationItem>
        </ul>
    )
}

export default NavigationItems
