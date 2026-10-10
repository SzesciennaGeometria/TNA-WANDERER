import { MigrationStructure } from '@/hooks/Mapper/mapRootProvider/types.ts';

// The animated border and outline switches arrived after version 5 had already been stored in
// people's browsers, so they get a migration of their own rather than a change to an old one.
export const to_7: MigrationStructure = {
  to: 7,
  up: prev => ({
    ...prev,
    interface: {
      ...prev?.interface,
      show_animated_border: prev?.interface?.show_animated_border ?? false,
      show_animated_outline: prev?.interface?.show_animated_outline ?? false,
      disable_animated_outlineborder: prev?.interface?.disable_animated_outlineborder ?? false,
    },
  }),
};
