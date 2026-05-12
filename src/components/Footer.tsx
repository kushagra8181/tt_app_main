'use client';
import { useRouter } from 'next/navigation'

const Footer = () => {
    const router = useRouter();
    return (
        <div className='footer-wrapper'>
            <div className='footer-content'  onClick={()=>(router.push('/tournaments'))}>
                <img src={'/icons/tournaments-inactive.svg'} alt="Company Logo" className='footer-logo' />
                <p className='footer-text'>Tournaments</p>
            </div>
            <div className='footer-content' onClick={()=>(router.push('/players'))}>
                <img src={'/icons/players-inactive.svg'} alt="Company Logo" className='footer-logo' />
                <p className='footer-text'>Players</p>
            </div>
            <div className='footer-content' onClick={()=>(router.push('/myprofile'))}>
                <img src={'/icons/profile-inactive.svg'} alt="Company Logo" className='footer-logo' />
                <p className='footer-text'>Profile</p>
            </div>
        </div>
    )
}

export default Footer
