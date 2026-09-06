import { Widget } from '@/hooks/Mapper/components/mapInterface/components';
import { SystemSettingsDialog } from '@/hooks/Mapper/components/mapInterface/components/SystemSettingsDialog/SystemSettingsDialog.tsx';
import { LayoutEventBlocker, SystemView, TooltipPosition, WdImgButton } from '@/hooks/Mapper/components/ui-kit';
import { ANOIK_ICON, DOTLAN_ICON, ZKB_ICON } from '@/hooks/Mapper/icons';
import { useMapRootState } from '@/hooks/Mapper/mapRootProvider';
import { getSystemStaticInfo } from '@/hooks/Mapper/mapRootProvider/hooks/useLoadSystemStatic';
import { isWormholeSpace } from '@/hooks/Mapper/components/map/helpers/isWormholeSpace.ts';
import { PrimeIcons } from 'primereact/api';
import { useCallback, useState } from 'react';
import { SystemInfoContent } from './SystemInfoContent';

export const SystemInfo = () => {
  const [visible, setVisible] = useState(false);

  const {
    data: { selectedSystems },
    storedSettings: { interfaceSettings },
  } = useMapRootState();

  const [systemId] = selectedSystems;

  const systemStaticInfo = getSystemStaticInfo(systemId)!;
  const {
    solar_system_name: solarSystemName,
    region_name: regionName,
    system_class: systemClass,
  } = systemStaticInfo || {};

  const isNotSelectedSystem = selectedSystems.length !== 1;

  const copySystemNameToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(solarSystemName);
    } catch (err) {
      console.error(err);
    }
  }, [solarSystemName]);

  const handleOpenZKB = useCallback(() => {
    if (!systemId) return;
    window.open(`https://zkillboard.com/system/${systemId}/`, '_blank');
  }, [systemId]);

  const handleOpenAnoikis = useCallback(() => {
    if (!solarSystemName) return;
    window.open(`https://anoik.is/systems/${solarSystemName}`, '_blank');
  }, [solarSystemName]);

  const handleOpenDotlan = useCallback(() => {
    if (!solarSystemName || !regionName) return;

    const isWH = isWormholeSpace(systemClass);
    const dotlanBehavior = interfaceSettings?.dotlan_behavior || 'system';
    if (isWH) {
      window.open(`https://evemaps.dotlan.net/system/${solarSystemName}`, '_blank');
      return;
    }

    const formattedRegion = regionName.replace(/ /gim, '_');
    if (dotlanBehavior === 'system') {
      window.open(`https://evemaps.dotlan.net/system/${solarSystemName}`, '_blank');
      return;
    }
    window.open(`https://evemaps.dotlan.net/map/${formattedRegion}/${solarSystemName}#${dotlanBehavior}`, '_blank');
  }, [solarSystemName, regionName, systemClass, interfaceSettings]);

  return (
    <Widget
      label={
        !isNotSelectedSystem && (
          <div className="flex justify-between items-center text-xs h-full w-full">
            <div className="flex gap-1">
              <SystemView systemId={systemId} className="select-none text-center" hideRegion />
              <LayoutEventBlocker className="flex gap-1 items-center">
                <WdImgButton className={PrimeIcons.COPY} onClick={copySystemNameToClipboard} />
                <WdImgButton
                  className="pi pi-pen-to-square"
                  onClick={() => setVisible(true)}
                  tooltip={{ position: TooltipPosition.top, content: 'Edit system name and description' }}
                />
              </LayoutEventBlocker>
            </div>

            <LayoutEventBlocker className="flex gap-1 items-center">
              <button type="button" onClick={handleOpenZKB} className="cursor-pointer">
                <img src={ZKB_ICON} alt="zKillboard" width="14" height="14" className="external-icon" />
              </button>
              <button type="button" onClick={handleOpenAnoikis} className="cursor-pointer">
                <img src={ANOIK_ICON} alt="Anoikis" width="14" height="14" className="external-icon" />
              </button>
              <button type="button" onClick={handleOpenDotlan} className="cursor-pointer">
                <img src={DOTLAN_ICON} alt="Dotlan" alt="" width="14" height="14" className="external-icon" />
              </button>
            </LayoutEventBlocker>
          </div>
        )
      }
    >
      {isNotSelectedSystem ? (
        <div className="w-full h-full flex justify-center items-center select-none text-center text-stone-400/80 text-sm">
          System is not selected
        </div>
      ) : (
        <SystemInfoContent systemId={systemId} onEditClick={() => setVisible(true)} />
      )}

      {visible && <SystemSettingsDialog systemId={systemId} visible setVisible={setVisible} />}
    </Widget>
  );
};
