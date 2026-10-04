import { SIGNATURES_GLOWINGROWS_TIMING } from '@/hooks/Mapper/constants/signatures.ts';
import { DotlanBehavior, MigrationStructure } from '@/hooks/Mapper/mapRootProvider/types.ts';

export const to_6: MigrationStructure = {
  to: 6,
  up: (prev: any) => {
    const signatureSettings = prev?.signatures || {};

    return {
      ...prev,
      interface: {
        ...prev?.interface,
        dotlanBehavior: prev?.interface?.dotlanBehavior ?? DotlanBehavior.system,
      },
      signatures: {
        ...signatureSettings,
        glowingrows_timing: signatureSettings.glowingrows_timing ?? SIGNATURES_GLOWINGROWS_TIMING.GLOWDEFAULT,
      },
    };
  },
};
