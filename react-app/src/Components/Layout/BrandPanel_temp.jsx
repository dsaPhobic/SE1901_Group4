import React from 'react'
import './BrandPanel.css'
import brand_logo from "../../assets/brand_logo.png"
const BrandPanel = () => {
    return (
        <div className="container">
            <img src={brand_logo} alt="" className='logo' />
            <h2 className="title">Start New Journey!</h2>

        </div>
    )
}

export default BrandPanel
