export const getExtraText = (place, field, language) => {
  const englishField = `${field}En`;
  return language === 'en' ? (place[englishField] || place[field] || '') : (place[field] || '');
};
