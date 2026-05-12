'use client'
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import ImageUploader from '@/utils/ImageCRop';
import apiCall from '@/lib/api';

type updateData = {
    name: string;
    phone_number: string;
    image_url: string | null;
}
const MyProfile = () => {
    const [userData, setUserData] = useState<any>({});
    const [isModal, setIsModal] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [editUserData, setEditUserData] = useState<updateData>({
        name: "",
        phone_number: "",
        image_url: null
    })
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const router = useRouter();
    useEffect(() => {
        const data = localStorage.getItem('userData');
        const loginToken = localStorage.getItem('uToken');
        if(!loginToken) {
            router.push('/login');
        }
        if (data) setUserData(JSON.parse(data));
        const fetchProfileImage = async () => {
            const data = await apiCall('users/api/profile-image', 'GET');
            setImageUrl(data?.url);
        }
        fetchProfileImage();
    },[]);
    const handleLogout = ()=>{
        localStorage.clear();
        router.push('/login');
    }
    const handleOpenModal = () => {
        setEditUserData({
            name: userData?.user_metadata?.name || userData?.name || '',
            phone_number: userData?.phone_number || '',
            image_url: userData?.user_metadata?.avatar_url || userData?.image_url || null
        });
        setIsModal(!isModal);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('uToken');
        const response = await apiCall('users/api/update-profile', 'PUT', { 
            name: editUserData?.name, 
            phone_number: editUserData?.phone_number, 
            image_url: editUserData?.image_url 
        });

        const data = await response;

        if (data?.image_key) {
        const imgResponse = await apiCall(`users/api/profile-image?suffix=original`, 'GET');
        const imgData = await imgResponse;
        setImageUrl(imgData?.url);
    }

        const updatedUser = { 
            ...userData, 
            name: editUserData.name, 
            phone_number: editUserData.phone_number, 
            image_url: profileImage || editUserData.image_url 
        };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setIsModal(false);
    };
    const getDisplayImage = () => {
        if (imageUrl) return imageUrl;
        if (userData?.user_metadata?.avatar_url) return userData.user_metadata.avatar_url;
        if (userData?.image_url && userData.image_url.startsWith('http')) return userData.image_url;
        return null;
    };
    

    return (
        <>
            {isModal && (
                <div className='editProfile-modal'>
                    <div className='modal-overlay' onClick={() => setIsModal(false)} />
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h4>Edit Profile</h4>
                            <button className='modal-close' onClick={handleOpenModal}>✕</button>
                        </div>
                        <div className='modal-body'>
                            <ImageUploader onConfirm={(img) => {
                                setProfileImage(img);
                                setEditUserData(prev => ({ ...prev, image_url: img }));
                            }} />
                            <div className='modal-input-section'>
                                <label>Name</label>
                                <input type='text' placeholder='Enter your name' 
                                    defaultValue={userData?.user_metadata?.name || userData?.name} 
                                    onChange={(e)=>setEditUserData(prev=>({...prev, name:e.target.value}))} 
                                />
                            </div>
                            <div className='modal-input-section'>
                                <label>Phone Number</label>
                                <input type='tel' placeholder='Enter your phone number' 
                                    onChange={(e) => setEditUserData(prev => ({ ...prev, phone_number: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button className='modal-save-btn' onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}
            <div className='profile-wrapper'>
                <div className='header-top'>
                    <h4>
                        My Profile
                    </h4>
                    <div className='notify-wrapper'>
                        <img src={'/icons/notify.svg'} alt='Notification' className='notify-img'/>
                        <p>Notify</p>
                    </div>
                </div>
                <div className='pfp'>
                <div className='box'></div>
                <div className='pfp-wrapper'>
                    {getDisplayImage() ? (
                        <img src={getDisplayImage()!} alt='profile' />
                    ) : (
                        <img src={'/icons/profile1.svg'} alt='default-profile' />
                    )}
                </div>
                </div>
                <div className='pf-details'>
                    <div className='details'>
                        <h5>{userData?.user_metadata?.name || userData?.name}</h5>
                        <p>{userData?.user_metadata?.email || userData?.email}</p>
                        <p>+91-{userData?.user_metadata?.email || userData?.phone_number}</p>
                    </div>
                </div>
                <div className="floating-create">
                    <button onClick={() => (setIsModal(true))}>Edit Profile</button>
                    <button onClick={handleLogout} style={{backgroundColor:'rgb(227, 89, 89)'}}>Logout</button>
                </div>
                <div className='pf-footer'>
                    <Footer/>
                </div>
            </div>
        </>
    )
}

export default MyProfile

