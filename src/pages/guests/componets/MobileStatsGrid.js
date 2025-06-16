import React from 'react';
import { Box } from '@mui/material';
import {
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  HelpOutline as HelpOutlineIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import StatCard from '../../../components/StatCard';

const MobileStatsGrid = ({ guests }) => {
  const confirmedCount = guests.filter(g => g.status === 'confirmed').length;
  const pendingCount = guests.filter(g => g.status === 'pending').length;
  const declinedCount = guests.filter(g => g.status === 'declined').length;
  const confirmedPercentage = guests.length > 0 
    ? Math.round((confirmedCount / guests.length) * 100) 
    : 0;

  return (
    <Box sx={{ mb: 3 }}>
      {/* Primeira linha */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 2,
        '& > *': { flex: 1 }
      }}>
        <StatCard
          icon={<PersonIcon fontSize="large" />}
          title="Convidados"
          value={guests.length}
          subtitle="convidados"
          color="primary"
          compact={true}
        />
        
        <StatCard
          icon={<CheckCircleIcon fontSize="large" />}
          title="Confirmados"
          value={confirmedCount}
          subtitle={`${confirmedPercentage}% do total`}
          color="success"
          compact={true}
        />
      </Box>

      {/* Segunda linha */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        '& > *': { flex: 1 }
      }}>
        <StatCard
          icon={<HelpOutlineIcon fontSize="large" />}
          title="Pendentes"
          value={pendingCount}
          subtitle="aguardando"
          color="warning"
          compact={true}
        />
        
        <StatCard
          icon={<CancelIcon fontSize="large" />}
          title="Recusados"
          value={declinedCount}
          subtitle="não virão"
          color="error"
          compact={true}
        />
      </Box>
    </Box>
  );
};

export default MobileStatsGrid;

