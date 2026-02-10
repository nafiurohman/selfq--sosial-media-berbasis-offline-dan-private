import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, initTheme, hasOnboarded } from '@/lib/storage';

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize theme on app load
    initTheme();

    // Check if user exists and has onboarded
    const user = getUser();
    const onboarded = hasOnboarded();
    
    if (user && onboarded) {
      navigate('/feed', { replace: true });
    } else {
      navigate('/onboarding', { replace: true });
    }
  }, [navigate]);

  return null;
}
