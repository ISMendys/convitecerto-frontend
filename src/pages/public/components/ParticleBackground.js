import React, { useCallback, useMemo } from 'react';
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";
// Import the original particle options generator and the fallback theme
import { generateParticlesOptions, elegantTheme } from './themes'; // Use the restored functions/theme

const ParticleBackground = ({ theme }) => {
  const particlesInit = useCallback(async (engine) => {
    // console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  // Use the original particle options generator, passing the current theme
  // Fallback to the default elegantTheme if no theme is provided
  const options = useMemo(() => generateParticlesOptions(theme || elegantTheme), [theme]);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      // Ensure particles are behind all other content
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
    />
  );
};

export default ParticleBackground;

