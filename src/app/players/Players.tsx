import Footer from '@/components/Footer'
import React from 'react'

const Players = () => {
  return (
    <div className='players-wrapper'>
        <div className='header-top'>
            <h4>
                My Profile
            </h4>
            <div className='notify-wrapper'>
                <img src={'/icons/notify.svg'} alt='Notification' className='notify-img'/>
                <p>Notify</p>
            </div>
        </div>
        This is players LoginPage
        <div className='pf-footer'>
            <Footer/>
        </div>
    </div>
  )
}

export default Players
