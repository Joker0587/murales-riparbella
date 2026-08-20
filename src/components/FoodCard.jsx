import React from 'react';
import { placeMapUrl, phoneLabel } from '../utils/navigation';

export default function FoodCard({ place, t }) {
  return (
    <article className="info-card food-card">
      <div className="food-visual" aria-hidden="true">
        {place.image ? <img src={place.image} alt="" loading="lazy" /> : <span>{place.name.split(' ').slice(0, 2).map((word) => word[0]).join('')}</span>}
      </div>
      <div className="food-card-top">
        <p className="type">{place.type}</p>
        {place.bestFor && <span className="food-badge">{place.bestFor}</span>}
      </div>
      <h3>{place.name}</h3>
      <p className="address">⌖ {place.address}</p>
      {place.note && <p className="place-note">{place.note}</p>}
      {place.phone ? <p className="phone">{phoneLabel(place.phone)}</p> : <p className="phone muted">{t.phoneUnavailable}</p>}
      <div className="button-row food-buttons">
        {place.phone && <a className="primary link" href={`tel:${place.phone}`}>{t.call}</a>}
        <a className={place.phone ? 'secondary link' : 'primary link'} target="_blank" rel="noreferrer" href={placeMapUrl(place)}>{t.takeMe}</a>
        {place.website && <a className="secondary link" target="_blank" rel="noreferrer" href={place.website}>{t.infoButton}</a>}
      </div>
    </article>
  );
}
