import { useEffect, useState } from 'react';

export default function CopyProtection() {
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    // Désactiver le menu contextuel (clic droit)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return false;
    };

    // Désactiver les raccourcis clavier de copie
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C, Ctrl+A, Ctrl+V, Ctrl+X, Ctrl+S, F12, Ctrl+Shift+I, Ctrl+U, Ctrl+P
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 'v' || e.key === 'x' || e.key === 's' || e.key === 'u' || e.key === 'p')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'u') ||
        e.key === 'F3'
      ) {
        e.preventDefault();
        e.stopPropagation();
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
        return false;
      }
    };

    // Désactiver la sélection avec la souris
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Désactiver le drag des images
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Désactiver l'impression
    const handlePrint = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Ajouter les événements
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    window.addEventListener('beforeprint', handlePrint);

    // Désactiver les outils de développement
    const disableDevTools = () => {
      // Détection simple des outils de développement ouverts
      console.log('Outils de développement détectés');
    };

    // Vérifier périodiquement si les outils de développement sont ouverts
    const devToolsCheck = setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      if (widthThreshold || heightThreshold) {
        disableDevTools();
      }
    }, 500);

    // Nettoyer les événements au démontage
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('beforeprint', handlePrint);
      clearInterval(devToolsCheck);
    };
  }, []);

  return (
    <>
      {showAlert && (
        <div 
          className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-[9999] animate-fade-in"
          style={{
            animation: 'fadeInOut 2s forwards'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">🔒 Contenu protégé</span>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
}