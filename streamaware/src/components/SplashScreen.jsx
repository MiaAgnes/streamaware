import { useRive } from '@rive-app/react-canvas';
import { useEffect } from 'react';
import styles from './SplashScreen.module.css';

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
    <div className={styles.container}>
      <RiveComponent style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }} />
    </div>
  );
}