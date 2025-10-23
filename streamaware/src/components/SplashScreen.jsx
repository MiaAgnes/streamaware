import { useRive } from '@rive-app/react-canvas';
import { useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
  const { RiveComponent, rive } = useRive({
    src: '/images/splash-animation.riv',
    autoplay: true,
  });

  useEffect(() => {
    if (!rive) return;

    // Lyt efter når animationen er færdig
    const onStop = () => {
      if (onComplete) {
        onComplete();
      }
    };

    // Når animationen stopper, kald onComplete
    rive.on('stop', onStop);

    // Alternativt: Sæt en timer (f.eks. 3 sekunder)
    const timer = setTimeout(() =>{
      if (onComplete) {
        onComplete();
      }
    }, 4000); // Juster tiden efter hvor lang din animation er

    return () => {
      rive.off('stop', onStop);
      clearTimeout(timer);
    };
  }, [rive, onComplete]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom, #342E36, #5B3F68)',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden',
    }}>
      <RiveComponent style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }} />
    </div>
  );
}