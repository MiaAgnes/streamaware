import { useRive } from '@rive-app/react-canvas';
import { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

export default function SplashScreen({ onComplete }) {
  const [hasError, setHasError] = useState(false);
  const [debugInfo, setDebugInfo] = useState('Loading animation...');
  
  const { RiveComponent, rive } = useRive({
    src: import.meta.env.DEV ? '/images/splash-animation.riv' : '/streamaware/images/splash-animation.riv',
    autoplay: true,
    onLoad: () => {
      console.log('Rive animation loaded successfully');
      setDebugInfo('Animation loaded');
    },
    onLoadError: (error) => {
      console.error('Rive animation failed to load:', error);
      setDebugInfo('Animation failed to load');
      setHasError(true);
    }
  });

  useEffect(() => {
    // Fallback timer - altid kald onComplete efter max 4 sekunder
    const fallbackTimer = setTimeout(() => {
      console.log('Splash screen timeout - proceeding to main app');
      if (onComplete) {
        onComplete();
      }
    }, 4000);

    // Hvis der er en fejl, spring splash over efter kort tid
    if (hasError) {
      const errorTimer = setTimeout(() => {
        console.log('Rive error detected - skipping splash screen');
        if (onComplete) {
          onComplete();
        }
      }, 1000);
      
      return () => {
        clearTimeout(fallbackTimer);
        clearTimeout(errorTimer);
      };
    }

    if (!rive) return () => clearTimeout(fallbackTimer);

    // Lyt efter når animationen er færdig
    const onStop = () => {
      console.log('Rive animation stopped');
      if (onComplete) {
        onComplete();
      }
    };

    // Når animationen stopper, kald onComplete
    rive.on('stop', onStop);

    return () => {
      rive.off('stop', onStop);
      clearTimeout(fallbackTimer);
    };
  }, [rive, onComplete, hasError]);

  return (
    <div className={styles.container}>
      {hasError ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          color: 'white',
          fontSize: '24px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>StreamAware</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>{debugInfo}</div>
        </div>
      ) : (
        <>
          <RiveComponent style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }} />
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '12px',
            opacity: 0.5
          }}>
            {debugInfo}
          </div>
        </>
      )}
    </div>
  );
}