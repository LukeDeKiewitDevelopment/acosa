import test from 'node:test';
import assert from 'node:assert/strict';

import { toFeaturedPropertyCard } from './featured-property-card.ts';

test('featured property cards include the business node label', () => {
  const card = toFeaturedPropertyCard({
    property: {
      id: 'hotel-one',
      data: {
        name: 'The Norton Stay',
        propertyType: 'guesthouse',
        acosaApproved: { approved: true },
        shortDescription: 'A stylish stay near the node core.',
        imageAlt: 'The Norton Stay exterior',
      },
    },
    image: {
      src: '/images/hotel-one.jpg',
      sizes: '(min-width: 1024px) 33vw, 100vw',
      width: 800,
      height: 600,
    },
    propertyTypeLabel: 'Guesthouse',
    businessNodeLabel: 'Centurion',
  });

  assert.equal(card.businessNodeLabel, 'Centurion');
  assert.equal(card.propertyTypeLabel, 'Guesthouse');
  assert.equal(card.name, 'The Norton Stay');
});
