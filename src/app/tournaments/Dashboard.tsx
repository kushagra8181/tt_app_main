'use client';

import Footer from "@/components/Footer";
import { tournamentApi } from "@/lib/tournaments";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
      const loginToken = localStorage.getItem('uToken');
      if (!loginToken) {
          router.push('/login');
          return;
      }
      const fetchTournaments = async () => {
          try {
              const response = await tournamentApi();
              setTournaments(response?.data);
          } catch (error) {
              console.error("Error fetching tournaments:", error);
          } finally {
              setLoading(false);
          }
      };
      fetchTournaments();
  }, []);

  const onClickTournament = (id: string) => {
    router.push(`/tournaments/${id}`);
  }
  return (
    <div className="dashboard-wrapper">
      <div className='header-top'>
          <h4>
              Tournaments
          </h4> 
          <div className='notify-wrapper'>
              <img src={'/icons/notify.svg'} alt='Notification' className='notify-img'/>
              <p>Notify</p>
          </div>
      </div>
      <div className="tournament-wrapper">
        {loading ? (
          <div className='loader-wrapper'>
              <div className='loader'></div>
          </div>
        )
        :tournaments.length > 0 && (
          tournaments.map((tournament) => (
            <div key={tournament.id} className="tournament-card" onClick={()=>{onClickTournament(tournament.id)}}>
              <div className="tournament-left">
                <img src={'/icons/tourn-card.svg'} alt='tournament' className='tournament-img'/>
              </div>
              <div className="tournament-right">
                <h3>{tournament.name}</h3>
                <p className="date-heading">Starts on: <b>{tournament?.start_date || 'N/A'}</b></p>
                <p className="date-heading">Last date of registration: <b>{tournament?.registration_end_date || 'N/A'}</b></p>
              </div>
            </div>
          ))
        ) }
          <div className="tournament-create">
            <button onClick={() => router.push('/tournaments/create')}>Create</button>
          </div>
      </div>
      <div className="pf-footer">
        <Footer/>
      </div>
    </div>
  )
}

export default Dashboard
