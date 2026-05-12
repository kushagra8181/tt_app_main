'use client'
import Footer from '@/components/Footer'
import { createTournamentApi } from '@/lib/tournaments'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type FieldError = {
  field: string;
  message: string;
}
type FormTypes = {
    name: string;
    description: string;
    location: string;
    status: string;
    start_time: string;
    end_time: string;
    start_date: string;
    end_date: string;
    registration_end_date: string;
    type: string;
    total_rounds: number;
}
const Create = () => {
    const [error, setError] = useState<FieldError[]>([]);
    const [formData, setFormData] = useState<FormTypes | null>(null);
    
    const router = useRouter();
    const getErrorMessage = (field: string) => {
        const fieldError = error?.find(err => err.field === field);
        return fieldError ? fieldError.message : '';
    };
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError([]);
        const nErrors: FieldError[] = [];
        const fd = new FormData(e.currentTarget);

        const name = fd.get('name') as string;
        const start_date = fd.get('start_date') as string;
        const end_date = fd.get('end_date') as string;
        const type = fd.get('type') as string;

        if (!name) nErrors.push({ field: 'name', message: 'Tournament name is required' });
        if (!type) nErrors.push({ field: 'type', message: 'Type is required' });
        if (!start_date) nErrors.push({ field: 'start_date', message: 'Start date is required' });
        if (!end_date) nErrors.push({ field: 'end_date', message: 'End date is required' });

        if (nErrors.length > 0) {
            setError(nErrors);
            return;
        }
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const data = await createTournamentApi({
                name,
                description: fd.get('desc') as string,
                location: fd.get('location') as string,
                status: 'upcoming',
                start_time: fd.get('stime') as string,
                end_time: fd.get('etime') as string,
                start_date: fd.get('start_date') as string || '',
                end_date: fd.get('end_date') as string || '',
                registration_end_date: fd.get('lastdate') as string,
                type,
                total_rounds: Number(fd.get('rounds'))
            });
            router.push('/tournaments');
        } catch (err) {
          console.error('Login error', err);
        }
    }
  return (
    <>
        <div className='create-wrapper'>
            <div className='header-top-left'>
                <div className='notify-wrapper-left' onClick={()=>(router.push('/tournaments'))}>
                    <img src={'/icons/back.svg'} alt='back' className='back-img'/>
                </div>
                <h4>
                    My Profile
                </h4>
            </div>
            <div className='create-content'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Tournament Name</label>
                        <input type="text" id="name" name="name" required />
                    </div>
                    <div>
                        <label>Description</label>
                        <input type="text" id="desc" name="desc" />
                    </div>
                    <div>
                        <label>Location</label>
                        <input type="text" id="location" name="location" />
                    </div>
                    <div>
                    <label>Start Date</label>
                        <input type="date" id="start_date" name="start_date" />
                        {getErrorMessage('start_date') && <p className='error-message'>{getErrorMessage('start_date')}</p>}
                    </div>
                    <div>
                        <label>End Date</label>
                        <input type="date" id="end_date" name="end_date" />
                        {getErrorMessage('end_date') && <p className='error-message'>{getErrorMessage('end_date')}</p>}
                    </div>
                    <div>
                        <label>Start Time</label>
                        <input type="time" id="stime" name="stime" />
                    </div>
                    <div>
                        <label>End Time</label>
                        <input type="time" id="etime" name="etime" />
                    </div>
                    <div>
                        <label>Last date to register</label>
                        <input type="date" id="lastdate" name="lastdate" />
                    </div>
                    <div>
                        <label>Type</label>
                        <select id="type" name="type">
                            <option value="">Select Type</option>
                            <option value="knockout">Knockout</option>
                            <option value="league">League</option>
                        </select>
                    </div>
                    <div>
                        <label>Rounds per match</label>
                        <select id="rounds" name='rounds'>
                            <option>Select Rounds</option>
                            <option value="1">1</option>
                            <option value='3'>3</option>
                            <option value='5'>5</option>
                        </select>
                    </div>
                    <button type="submit">Create Tournament</button>
                </form>
            </div>

        </div>
        <div className="pf-footer">
            <Footer/>
        </div>
    </>
  )
}

export default Create
