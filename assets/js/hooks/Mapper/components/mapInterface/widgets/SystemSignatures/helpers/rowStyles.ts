import { ExtendedSystemSignature, SignatureGroup } from '@/hooks/Mapper/types';
import clsx from 'clsx';
import { getRowBackgroundColor } from './getRowBackgroundColor';
import classes from './rowStyles.module.scss';

export function getSignatureRowClass(
  row: ExtendedSystemSignature,
  selectedSignatures: ExtendedSystemSignature[],
  colorByType?: boolean,
): string {
  const isSelected = selectedSignatures.some(s => s.eve_id === row.eve_id);

  const baseCls = [ //fanaberiatracker - kolorowanie wierszy w oknie sygnatur, pytanie czy da sie zrobic oninsert czy cos
    classes.TableRowCompact,
    getRowBackgroundColor(row.inserted_at ? new Date(row.inserted_at) : undefined),
    'transition duration-200 my-2 hover:bg-purple-400/20',
  ];

  if (isSelected) {
    return clsx([...baseCls, 'bg-violet-400/40 hover:bg-violet-300/50']);
  }

  if (row.deleted) {
    return clsx([...baseCls, 'bg-red-400/40 hover:bg-red-400/50']);
  }

  if (row.inserted_at) { //fanaberiatracker - kolorowanie wklejonych wierszy do okna sygnatur
    const localNow = new Date().getTime();
    const timeDiff = (localNow - 7200000) //fanaberia - korekta strefy czasowej serwera eve +2h w milisekundach
    const insertedAge = timeDiff - new Date(row.inserted_at).getTime();
    const updatedAge = row.updated_at ? timeDiff - new Date(row.updated_at).getTime() : Infinity;
    if (insertedAge > 0 && insertedAge < 5000 && (insertedAge === updatedAge || !row.updated_at)) {
      return clsx([...baseCls, 'transition duration-500 bg-green-900/40 hover:bg-green-900/60']);
    }
    if (updatedAge > 0 && updatedAge < 1000) {
      return clsx([...baseCls, 'transition duration-500 bg-orange-300/20 hover:bg-orange-300/60']);
    }
  }

  // Apply color by type styling if enabled
  if (colorByType) {
    switch (row.group) {
      case SignatureGroup.CosmicSignature:
        return clsx([...baseCls, '[&_td:nth-child(-n+3)]:text-rose-400 [&_td:nth-child(-n+3)]:hover:text-rose-300']);
      case SignatureGroup.Wormhole:
        return clsx([...baseCls, '[&_td:nth-child(-n+3)]:text-sky-300 [&_td:nth-child(-n+3)]:hover:text-sky-200']);
      case SignatureGroup.CombatSite:
      case SignatureGroup.RelicSite:
      case SignatureGroup.DataSite:
      case SignatureGroup.GasSite:
      case SignatureGroup.OreSite:
        return clsx([...baseCls, '[&_td:nth-child(-n+4)]:text-lime-400 [&_td:nth-child(-n+4)]:hover:text-lime-300']);
    }

    // Default for color by type - apply same color as CosmicSignature (red) and small text size
    return clsx([...baseCls, '[&_td:nth-child(-n+3)]:text-rose-400/100']);
  }

  // Original styling when color by type is disabled
  return clsx(...baseCls);
}
