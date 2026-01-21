import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DayRedirect = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const dayId = Number(id);
    if (!Number.isFinite(dayId)) {
      navigate('/', { replace: true });
      return;
    }
    navigate(`/?day=${dayId}`, { replace: true });
  }, [id, navigate]);

  return null;
};

export default DayRedirect;
