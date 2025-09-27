import React from 'react'
import styles from './BrandPanel.module.css'
import brand_logo from "../../assets/brand_logo.png"
const BrandPanel = () => {
    return (
        <div className={styles.container}>
            <img src={brand_logo} alt="" className={styles.logo} />
            <h2 className={styles.title}>Start New Journey!</h2>

        </div>
    )
}

export default BrandPanel
