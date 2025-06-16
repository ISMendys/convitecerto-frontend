// GuestsGallery.js
import React from 'react';
import { Box } from '@mui/material';
import GuestCard from '../../../components/GuestCard';

const GuestsGallery = ({ guests, onEdit, onMenuOpen, onSelect, selectedGuests }) => (
  <Box
    sx={{
      display: 'grid',
      gap: 2,
      // define 1 coluna no xs, 2 no sm+, 3 no md+
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(3, 1fr)',
        md: 'repeat(4, 1fr)'
      }
    }}
  >
    {guests.map(guest => (
      <Box key={guest.id} sx={{ display: 'flex' }}>
        <GuestCard
          guest={guest}
          onEdit={() => onEdit(guest)}
          onMenuOpen={e => onMenuOpen(e, guest)}
          selected={selectedGuests.includes(guest.id)}
          onSelect={() => onSelect(guest.id)}
          sx={{ width: '100%' }}     // Card preenche todo o grid cell
        />
      </Box>
    ))}
  </Box>
);

export default GuestsGallery;
