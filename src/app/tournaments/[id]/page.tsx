'use client';

import Footer from "@/components/Footer";
import { getTournamentById } from "@/lib/tournaments";
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

type PageProps = {
    params: {
        id: string;
    }
}

type Tournament = {
  id: number;
  name: string;
  description: string;
  type: 'knockout' | 'league';
  status: 'upcoming' | 'ongoing' | 'completed';
  location: string;
  organizer_id: number;
  total_rounds: number;
  start_date: string;
  end_date: string;
  registration_end_date: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

const TournamentDetail = () => {
    const params = useParams();
    const id = String(params?.id);
    const router = useRouter();
    const [tournamentDetails, setTournamentDetails] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loginToken = localStorage.getItem('uToken');
        if(!loginToken) {
            router.push('/login');
            return;
        }

        const fetchTournamentDetails = async () => {
          try {
            const response = await getTournamentById(id);
            setTournamentDetails(response?.data[0]);
          }
          catch (error) {
            console.error("Error fetching tournament details:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchTournamentDetails();
    }, [id, router]);

    // if (!tournamentDetails) return <div>Tournament not found</div>;

    return (
        <div className='tournament-detail-wrapper'>
            <div className='header-top-left'>
                <div className='notify-wrapper-left' onClick={() => router.back()}>
                    <img src={'/icons/back.svg'} alt='back' className='back-img' />
                </div>
                <h4>Tournament Details</h4>
            </div>
            {loading ? (
                <div>Loading...</div>
            ):(
                <div className='tournament-detail-content'>
                    <img src="/icons/tourn-card.svg" alt="Tournament" className='tournament-detail-img' />
                    <div className='tournament-detail-info'>
                        <h1>{tournamentDetails?.name}</h1>
                        <p className='description'>{tournamentDetails?.description}</p>

                        <div className='detail-row'>
                            <div className='detail-chip'>{tournamentDetails?.type}</div>
                            <div className={`detail-chip status-${tournamentDetails?.status}`}>{tournamentDetails?.status}</div>
                        </div>

                        <div className='detail-section'>
                            <div className='detail-item'>
                                <span className='detail-label'>Location</span>
                                <span className='detail-value'>{tournamentDetails?.location}</span>
                            </div>
                            <div className='detail-item'>
                                <span className='detail-label'>Total Rounds</span>
                                <span className='detail-value'>{tournamentDetails?.total_rounds}</span>
                            </div>
                        </div>

                        <div className='detail-section'>
                            <div className='detail-item'>
                                <span className='detail-label'>Start Date</span>
                                <span className='detail-value'>{tournamentDetails?.start_date}</span>
                            </div>
                            <div className='detail-item'>
                                <span className='detail-label'>End Date</span>
                                <span className='detail-value'>{tournamentDetails?.end_date}</span>
                            </div>
                        </div>

                        <div className='detail-section'>
                            <div className='detail-item'>
                                <span className='detail-label'>Start Time</span>
                                <span className='detail-value'>{tournamentDetails?.start_time}</span>
                            </div>
                            <div className='detail-item'>
                                <span className='detail-label'>End Time</span>
                                <span className='detail-value'>{tournamentDetails?.end_time}</span>
                            </div>
                        </div>

                        <div className='detail-item'>
                            <span className='detail-label'>Registration Ends</span>
                            <span className='detail-value'>{tournamentDetails?.registration_end_date}</span>
                        </div>
                    </div>
                </div>
            )}
            <div className="pf-footer">
                <Footer/>
            </div>
        </div>
    )

}

export default TournamentDetail;
