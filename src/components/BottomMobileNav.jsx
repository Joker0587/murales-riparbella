import React from 'react';

export default function BottomMobileNav({ t }) {
  const jump = (event, id) => { event.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  return (
    <nav className="bottom-mobile-nav" aria-label={t.quickNav || 'Navigazione rapida'}>
      <a href="#mappa" onClick={(e) => jump(e, 'mappa')}>{t.navMap || t.map}</a>
      <a href="#parcheggi" onClick={(e) => jump(e, 'parcheggi')}>{t.navParking || t.parking}</a>
      <a href="#oltre-murales" onClick={(e) => jump(e, 'oltre-murales')}>{t.navBeyond || 'Oltre'}</a>
      <a href="#dove-fermarsi" onClick={(e) => jump(e, 'dove-fermarsi')}>{t.navFood || t.food}</a>
    </nav>
  );
}
